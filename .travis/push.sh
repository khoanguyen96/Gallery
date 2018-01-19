#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_dist_directory() {
  git add -f dist/*
  git commit --message "Travis Build: $TRAVIS_TAG"
}

upload_git() {
  git remote add origin https://${GH_TOKEN}@github.com/khoanguyen96/Gallery.git
  git push --quiet --set-upstream origin master
}

setup_git
commit_dist_directory
upload_git
