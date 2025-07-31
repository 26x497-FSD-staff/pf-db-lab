#!/bin/bash
set -e

echo "Running MongoDB initialization script..."

# mongosh <<EOF
# use admin
# db.createUser({
#   user: "$MONGO_ROOT_USER",
#   pwd: "$MONGO_ROOT_PASSWORD",
#   roles: [{ role: "root", db: "admin"}]
# })
# EOF

mongosh <<EOF
use $MONGO_DB
db.createUser({
  user: "$MONGO_USER",
  pwd: "$MONGO_PASSWORD",
  roles: [{ role: "readWrite", db: "$MONGO_DB"}]
})
EOF

echo "Database and user initialized successful"