#!/bin/bash
IDS=(
  "nvo7jmzDDew" "B6aJYT5wxkk" "9AgEcQqPyT8" "nxQoGX2xYzg"
  "AJOSosa1CY4" "yjvW-sC3kTY" "0AAZ_ZCKevA"
  "70l1tDAI6rM" "G-UY6udEPPE" "k0Pv3gayBCo"
  "dEFWG_4klSA" "5WZyTQMG23w" "1dTIVth36WQ"
  "1596541223130-5d31a73fb6c6" "1550133730-695473e544be" "1502444330042-d1a1ddf9bb5b"
  "1614594975525-e45190c55d0b" "1592924357228-91a4daadcfea" "1494438639946-1ebd1d20bf85"
)

for ID in "${IDS[@]}"; do
  URL="https://images.unsplash.com/photo-$ID?w=800&q=80"
  TYPE=$(curl -sI "$URL" | grep -i "content-type" | awk '{print $2}' | tr -d '\r')
  echo "$ID: $TYPE"
done
