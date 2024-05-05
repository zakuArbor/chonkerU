#!/usr/bin/perl
#source: https://convocation.carleton.ca/ceremony/graduate-listing/
#DATE OF EXTRACTION: May 4 2024
use JSON qw( decode_json );     # From CPAN
use Data::Dumper;               # Perl core module
use strict;                     # Good practice
use warnings;                   # Good practice


open my $fh, "<", "data2.json";
my $json = <$fh>;
my $decoded_json = decode_json($json);
my $data_arr = $decoded_json->{'data'};

$json = JSON->new->allow_nonref->convert_blessed;

#remove unneeded fields
foreach(@{$data_arr}) {
  delete $_->{'mention'};
  delete $_->{'lastName'};
  delete $_->{'firstName'};
  delete $_->{'middleName'};
  delete $_->{'diplomaName'};
  delete $_->{'catalogue'};
  delete $_->{'medals'};
  delete $_->{'ctime'};
  delete $_->{'ceremony'};
  delete $_->{'supervisor'};
  delete $_->{'thesis'};
  delete $_->{'studyAbroad'};
  delete $_->{'prevDeg'};
  delete $_->{'campusCode'};
  delete $_->{'degCode'};
  delete $_->{'faculty'};
  #print Dumper $_;
}

#retrieve data that has math as a major or minor in the year of 2023
#undergrad data only
my @math = ();
foreach(@{$data_arr}) {
  if ($_->{'level'} !~ m/UG/) {
    next;
  }
  # apparently the dataset doesn't set a major for every student like CS students
  #if (!defined $_->{'major'} || length $_->{'major'} == 0) {
  #  print "Skipped" . "$_->{'major'}" . "-" . "$_->{'minor'}" . "\n";
  #  next;
  #}
  #if ($_->{'major'} =~ m/Math/i) {
  #  push(@math, $_);
  #}
  if ($_->{'degDesc'} =~ m/Math|Stat/i) {
    push(@math, $_);
  }
  elsif (defined $_->{'minor'} && length $_->{'minor'} != 0 && $_->{'minor'} =~ m/Math/i) {
    push(@math, $_);
  }
}

#aggregate data
#number of honors math
#number of major math
#number of minor math
#aggregate majors that have a minor in math

my $data = {
  'honor' => {
      'Mathematics' => {
        'num' => 0,
        'hd' => 0,
        'd' => 0,
        'coop' => 0,
        'minor' => {}
      },
      'Statistics' => {
        'num' => 0,
        'hd' => 0,
        'd' => 0,
        'coop' => 0,
        'minor' => {}
      },
  },
  'major' => { 
    'Mathematics' => {
      'num' => 0,
      'hd' => 0,
      'd' => 0,
      'coop' => 0,
      'minor' => {}
    },
    'Statistics' => {
      'num' => 0,
      'hd' => 0,
      'd' => 0,
      'coop' => 0,
      'minor' => {}
    },
  },
  'minor' => {
    'num' => 0,
    'hd' => 0,
    'd' => 0,
    'coop' => 0,
    'major' => {}
  },
};

my $type;

foreach(@math) {
  my $is_minor = 1;
  my $major = $_->{'major'};
  if (defined $major && $major =~ m/math|stat/i) {
    $is_minor = 0;
  }
  if (!$is_minor) {
    if ($_->{'degDesc'} =~ m/Honours/) {
      $type = $data->{'honor'}->{$major};
    }
    else {
      $type = $data->{'major'}->{$major};
    }

    my $minor = $_->{'minor'};
    if (length $minor != 0) {
      (undef, $minor) = split('Minor in ', $minor);
      my $hash_minor = $type->{'minor'};
      if (exists $hash_minor->{$minor}) {
        $hash_minor->{$minor}++;
      }
      else {
        $hash_minor->{$minor} = 1;
      }
    }
  }
  else { #minor
    $type = $data->{'minor'};
    if (!defined $major || length $major == 0) {
      $_->{'degDesc'} =~ /^Bachelor of (\w+\s?\w+)/;
      $major = $1;
    }
    my $hash_major = $type->{'major'};
    if (exists $hash_major->{$major}) {
      $hash_major->{$major}++;
    }
    else {
      $hash_major->{$major} = 1;
    }
  }

  if (length($_->{'distinction'}) != 0) {
    if ($_->{'distinction'} =~ m/high/i) {
      $type->{'hd'}++;
    }
    else {
      $type->{'d'}++;
    }
  }
  if (defined($_->{'coop'}) && length($_->{'coop'}) != 0) {
    $type->{'coop'}++;
  }

  $type->{'num'}++;
}


#print Dumper @math;
print Dumper $data;
my $data_json = $json->encode($data);
my $filename = "s23-f23-w24.json";
open(FH, '>', $filename) or die $!;
print FH $data_json;
close(FH);
