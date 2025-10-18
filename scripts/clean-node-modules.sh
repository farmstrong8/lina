#!/bin/bash
# This script finds and removes all 'node_modules' directories in the project.

find . -name "node_modules" -type d -prune -exec rm -rf '{}' +