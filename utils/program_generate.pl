#!/usr/bin/perl

=head1 NAME

program_generate.pl - Parses programs.json and creates two files: 'programs-list.json', 'program.json'  
=head1 SYNOPSIS

Default Usage: 
program-generate.pl

=head1 DEPENDENCIES

=over

=item *JSON::Parse 
=item *Web::Scraper

=back

=head1 AUTHORS

zakuarbor (Ju Hong Kim)

=cut

use strict;
use warnings;
use Getopt::Long;
use JSON 'decode_json';
use JSON 'encode_json';
use Digest::MD5 qw(md5 md5_hex md5_base64);
#use Web::Scraper;
#use Encode;
#use HTML::TreeBuilder;
use Data::Dumper;
#use LWP::Simple;
use LWP::UserAgent;
use Mojo::DOM;

#use DateTime;
use Date::Parse;

my $verbose  = 0;
my $subject  = 0;
my $help     = "";
my $data_dir = "../data/";
my $dest_dir = "../data/";
my $in_file  = "programs.json";

my $PROG;
( $PROG = $0 ) =~ s/.*[\/\\]//g;

my $usage = "Usage: $PROG";

GetOptions(
    "verbose"   => \$verbose,
    "subject=s" => \$subject,
    "help"      => \$help
) or die("Error in command line arguments\n");

if ($help) {
    print $usage;
    exit 0;
}

################################################################################

=head1 SUBROUTINES

=head2 get_files
@param subject: the subject to look intp
@return: an array of all the files (course) relating to the subject
=cut

################################################################################
sub get_files {
    my $subject = shift;
    my $dir     = ${data_dir} . ${subject};
    if ( !-e $dir or !-d $dir ) {
        print( STDERR
              "Error: ${dir} either does not exist or is not a directory\n" );
        return ();
    }
    my @files = `ls $dir`;
    chomp(@files);
    return @files;
}

################################################################################

=head2 parse_json
@param programs: a reference to the json containing multiple program information   
@return: a tuple of two hash of the contents of the file: programs, and program
=cut

################################################################################
sub parse_json {
    my ( $programs_ref ) = @_;
    my %progs_hash;
    $progs_hash{"programs"} = qw();
    my %prog_hash;
    for my $prog (keys %{$programs_ref}) {
        parse_prog($prog, $programs_ref->{$prog},\%progs_hash, \%prog_hash);
        #print(Dumper($programs_ref->{$prog}));
    }
    print(Dumper(%prog_hash));
    return ( \%progs_hash, \%prog_hash );
}

################################################################################

=head2 parse_prog
@param prog: the name of the program
@param hashref: the object containing a program's information
@param programs_hashref: the hash reference where parsed data of the list of programs are stored
@param prog_hashref: the hash reference where parsed data of each individual programs are stored
=cut        

################################################################################
sub parse_prog {
    my ($prog, $hashref, $progs_hashref, $prog_hashref) = @_;
#    print(Dumper($hashref));
    my $md5 = Digest::MD5->new;
    $md5->add($prog);
    my $key = $md5->hexdigest;
    $prog_hashref->{$key} = $hashref;
    $prog_hashref->{$key}{"program_name"} = $prog;
    my $data = {
        "program" => $prog,
        "credits" => $hashref->{'credits'},
        "included_credits" => $hashref->{"included"}{'credits'},
        "discluded_credits" => $hashref->{"not-included"}{'credits'},
        "id" => $key
    };
    push(@{$progs_hashref->{"programs"}}, $data);
}

################################################################################

=head2 get_basic_prog_data
@param prog: the name of the program
@param hashref: the object containing a program's information@param content: a reference to the subject data
@return: a reference to basic prog data
=cut

################################################################################
sub get_basic_prog_data {
    my ( $prog, $hashref ) = @_;
    my $md5 = Digest::MD5->new;
    $md5->add($prog);
    my $key = $md5->hexdigest;
    my $data = {
        "program" => $prog,
        "credits" => $hashref->{'credits'},
        "included_credits" => $hashref->{"included"}{'credits'},
        "discluded_credits" => $hashref->{"not-included"}{'credits'},
        "id" => $key
    };
    return \$data;
}

################################################################################

=head2 write2json
@param subject: a string 
@param type: a string either 'course' or 'prof'
@param content: a reference to a hash
=cut                                                                            

################################################################################
sub write2json {
    my ( $name, $hash ) = @_;
    my $json = encode_json $hash;
    my $file = $dest_dir . $name . ".json";
    open( my $fh, ">:encoding(UTF-8)", $file )
      or die("Cannot open '${file}': $!\n");
    print $fh $json;
    close($fh);
}

################################################################################

=head2 writeCoursesList 
@param subject: a string
@param hash: data
@return: a list of courses that did not have a name (needs further processing)
=cut

################################################################################
sub writeCoursesList {
    my ( $subject, $hash ) = @_;
    $subject = lc $subject;

    my @courses;
    my @bad_courses = qw();

    my %data;

    print(Dumper($hash));

    foreach my $key ( sort keys %{$hash} ) {

        #print($hash->{$key}[0]{"course"});
        my $name = $hash->{$key}->{'info'}->{'name'};
        if (defined $hash->{$key}->{'info'}->{'name'}) {
          $name = "TBD";
          push(@bad_courses, $key);
        }
        my %course = ( 'code' => $key, 'name' => $hash->{$key}->{'info'}->{'name'}, 'desc' => $hash->{$key}->{'info'}->{'desc'} );
        push( @courses, \%course );
    }

    $data{"courses"} = \@courses;
    $data{"total"}   = scalar @courses;

    my $json = encode_json \%data;
    my $file = $dest_dir . $subject . '_' . "courses" . ".json";
    open( my $fh, ">:encoding(UTF-8)", $file )
      or die("Cannot open '${file}': $!\n");
    print $fh $json;
    close($fh);
    return \@bad_courses;
}

################################################################################
=head2 writeProgramApi
@param subject: a string
@param hash: data
=cut

################################################################################
sub writeProgApi {
    my ( $hash ) = @_;
    
    foreach my $prog ( keys %{$hash} ) {
        my $json = encode_json $hash->{$prog};
        my $file = $dest_dir . $prog . ".json";
        open( my $fh, ">:encoding(UTF-8)", $file )
          or die("Cannot open '${file}': $!\n");
        print $fh $json;
        close($fh);
    }
}

################################################################################
=head2 writeProfApi
@param subject: a string
@param hash: data
=cut

################################################################################
sub writeProfApi {
    my ( $course_hash, $prof_hash ) = @_;
    
    foreach my $prof ( keys %{$prof_hash} ) {
        print("Professor $prof\n");
        my %data = ();
        #print(Dumper($prof_hash));
        my $md5 = Digest::MD5->new;
        $md5->add(utf8::is_utf8($prof) ? Encode::encode_utf8($prof) : $prof);
        my $key = $md5->hexdigest;
#        print(Dumper($prof_hash->{$prof}));
        $data{"courses"} = $prof_hash->{$prof};
        $data{"prof"} = $prof;
        ($data{"stats"}, $data{"latest"}) = getProfStudentEnrollment($prof_hash->{$prof}, $prof);
#        $course_hash->{$course}{'profs'} =
#          getProfTeachCount( $course, $prof_hash );
#        $course_hash->{$course}{'enrol_avg'} = getAvgEnrollment($course_hash->{$course}->{'history'});
        my $json = encode_json \%data;
        my $file = $dest_dir . "prof/" . $key . ".json";
        open( my $fh, ">:encoding(UTF-8)", $file )
          or die("Cannot open '${file}': $!\n");
        print $fh $json;
        close($fh);
    }
}

################################################################################
=head2 getProfStudentEnrollment
@param hash (object): a hash containing courses as the key and a list of course entries as the values
@return: a hash where the keys are the semesters and the values are the number of students taught in that particular semester
=cut
################################################################################
sub getProfStudentEnrollment {
    my ($ref, $prof) = @_;
    my %sem = ();
    my $latest = -1;
    foreach my $course_code ( keys %{$ref} ) {
        foreach my $course (@{$ref->{$course_code}->{"history"}}) {
            my $key = $course->{'year'} . '-' . $course->{'sem'};
            if (not exists $sem{$key}) {
                $sem{$key} = 0;
            }
            $sem{$key} += $course->{'enrol'};
            if ($latest < 0 || exists $ref->{$course_code} && exists $ref->{$course_code}->{'latest'} && $ref->{$course_code}->{'latest'} > $latest) {
                $latest = $ref->{$course_code}->{'latest'};
            }
        }
    }
    return (\%sem, $latest);
}

################################################################################
# MAIN
################################################################################
if ($verbose) {
    print("flag: VERBOSE ENABLED\n");
    if ($subject) {
        print("flag: SUBJECT PROVIDED: ${subject}\n");
    }
}

my $file = $data_dir . $in_file;
my $json_str = do {
  open( my $fh, "<:encoding(UTF-8)", $file)
    or die("Cannot open '${file}': $!\n");
  local $/;    #slurp mode i.e. dump content into a string
  <$fh>;
};
close($file);
my $programs = decode_json($json_str);

my ($progs_hashref, $prog_hashref) = parse_json($programs);
print(Dumper($progs_hashref));
write2json('programs-list', $progs_hashref);
writeProgApi($prog_hashref);