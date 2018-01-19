#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_dist_directory() {
  git checkout master                                 # leave DETACHED state
  git add -f dist/*                                   # add all built dist files
  git commit --message "Travis Build: $TRAVIS_TAG"    # commit as Travis CI
}

upload_git() {
  git remote add origin-travis https://${GH_TOKEN}@github.com/khoanguyen96/Gallery.git
  git push --quiet --set-upstream origin-travis master
}

setup_git
commit_dist_directory
upload_git
