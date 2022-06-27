#!/bin/bash

for username in $(ls -1 ./data); do
  for selected_date in $(ls -1 ./data/$username); do
    if [[ $selected_date =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then

      posts_original=$(cat ./data/$username/$selected_date/posts_original.json | jq '.[].node | {code: .shortcode, likes: .edge_media_preview_like.count, comments: .edge_media_to_comment.count}')
      posts=$(cat ./data/$username/$selected_date/posts.json | jq '.[] | {code: .shortcode, likes: .totals.likes, comments: .totals.comments}')

      posts_original_hash=$(sha1sum <<< $posts_original)
      posts_hash=$(sha1sum <<< $posts)

      if [[ $posts_original_hash == $posts_hash ]]; then
          echo "Files OK"
      else
          echo "Failed: $username -> $selected_date"
          git diff $(git hash-object -w --stdin <<< $posts_original) $(git hash-object -w --stdin <<< $posts)
      fi
    fi
  done
done
