#!/bin/bash
bullshit1() { echo $1 && echo $2 && echo $@; }
bullshit2() { printf "$1" && printf "$2" && printf "$@"; }
smth() { echo $@; }

# bullshit2 hi dog

# Can't have spaces with = as it interprets it as separate commands
COUNTER=0
while [ $COUNTER -lt 10 ]; do
	echo $COUNTER
	let COUNTER+=1
done

COUNTER=10
until [ $COUNTER -lt 0 ]; do
	echo $COUNTER
	let COUNTER-=1
done

WORDS=(cat dog tree)
# use @ to expand array
for w in ${WORDS[@]}; do
	echo $w
done

WORDS+=(jimmy)
for w in ${WORDS[@]}; do
	echo $w
done

url="https://jsonplaceholder.typicode.com/comments"
responses=()
for postId in {1..10};
do
  # Make API call to fetch emails of this posts's commenters
  response=$(curl "${url}?postId=${postId}")

  # Use jq to parse the JSON response into an array
  responses+=("$response")
done

for r in ${responses[@]}; do
	echo $r
done

lsarr=($(ls))
for f in ${lsarr[@]}; do
	printf "$f "
done
echo