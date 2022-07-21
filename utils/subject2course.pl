#!/usr/bin/perl

=head1 NAME

subject2course.pl - Given a subject, parses all available data in 
                    B<utils/data> for that particular subject and 
                    write individual files for each course

=head1 SYNOPSIS

Default Usage: 
subject2course.pl

Subject Usage:
subject2course.pl -s phys

Verbose Usage:
subject2course.pl -v

Note: default parses only math

=head1 DEPENDENCIES

=over

=item *JSON::Parse 

=back

=head1 AUTHORS

zakuarbor (Ju Hong Kim)

=cut

use strict;
use warnings;
use Getopt::Long;
use JSON 'decode_json';
use Data::Dumper;

my $verbose = 0;
my $subject = 0;
my $help    = "";
my $data_dir= "data/";

my $PROG;
($PROG = $0) =~ s/.*[\/\\]//g;

my $usage = 
"Usage: $PROG [-s <subject> -v]

-s <subject>    parses a particular subject. Default: math
-v              verbos
-help           display the usage information
";

GetOptions (
  "verbose"   =>  \$verbose,
  "subject=s" =>  \$subject,
  "help"      =>  \$help
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
  my $dir = ${data_dir} . ${subject};
  if (!-e $dir or ! -d $dir) {
    print(STDERR "Error: ${dir} either does not exist or is not a directory\n");
    return ();
  }
  my @files = `ls $dir`;
  chomp(@files);
  return @files;
}

################################################################################
=head2 parse_files
@param subject: the subject being parsed
@param files_ref:  a reference to all the files to parse 
@return: a hash of the contents of the file
=cut
################################################################################
sub parse_files {
  my ($subject, $files_ref) = @_;
  my %hash;
  for (@$files_ref) {
    my $file = $data_dir . $subject . "/" . $_;
    parse_file($file, \%hash);
  }
  return \%hash;
}

################################################################################
=head2 parse_file
@param file: the file to parse
@param hash_ref: the hash reference where parsed data is stored
=cut        
################################################################################
sub parse_file {
  my ($file, $hash_ref) = @_;
  my $json_str = do {                                                         
    open(my $fh, "<:encoding(UTF-8)", $file) or die("Cannot open '${file}': $!\n");
    local $/; #slurp mode i.e. dump content into a string                     
    <$fh>                                                                     
  };                                                                          
  close($file);    
  my $content = decode_json($json_str);
  #  print Dumper($content);
  my $courses = $content->{"courses"};
  #  print (Dumper($courses));
  #  print(Dumper($courses));
  
  for my $i (0 .. $#{$courses}) {
    my $course = ${courses}->[$i];
    my $level = substr($course, 4, 1);

    #ignoring 0000 and 5000+ level courses
    if (not $level=~ /\d/ or $level == 0 or $level > 4) {
      print("Ignoring ${course}\n");
      next;
    }
    my $data = get_course_data(\$content, $i);
    if (not defined $data) {
      next;
    }
    if (exists $courses->[$course]) {
      #print Dumper($courses->[$course]);
      #      push(@{$courses}->[$course], $data);  
    }
  }
}

################################################################################
=head2 get_course_data
@param content: a reference to the subject data
@param index: 
@return: a reference to course data
=cut
################################################################################
sub get_course_data {
  my ($content, $i) = @_;
  
  if (not ${$content}->{"courses"}[$i] =~ /[A-Z]{4}\d{4}/) {
    return undef;
  }
  if (${$content}->{"prof"}[$i] eq '\u00a0') {
    return undef;
  }
  
  my %course = (
    'crn' => ${$content}->{"crn"}[$i],
    'prof' => ${$content}->{"prof"}[$i],
    'type' => ${$content}->{"type"}[$i],
    'enrol' => ${$content}->{"enrol"}[$i],
    'year' => ${$content}->{"year"},
    'sem' => ${$content}->{"sem"},
    'source'=> ${$content}->{"source"}
  );
 
  print(Dumper(%course)); 
  if (not $course{'enrol'} =~ /\d+/) {
    $course{'enrol'} = 0;
  }
  die();
  return \%course;

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

chomp($subject);

if (length($subject) > 0 and length($subject) !=4) {
  print(STDERR "Error: Subject ${subject} must be a 4 letter course code");
  exit(1)
}

$subject = uc $subject;

my @files = get_files($subject);
my $courses_ref = parse_files($subject, \@files);
