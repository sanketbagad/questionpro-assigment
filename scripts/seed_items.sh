#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' ../.env | xargs)

# Extract DB credentials from DATABASE_URL
PG_USER=$(echo $DATABASE_URL | sed -E 's|^postgres://([^:]+):.*|\1|')
PG_PASSWORD=$(echo $DATABASE_URL | sed -E 's|^postgres://[^:]+:([^@]+)@.*|\1|')
PG_HOST=$(echo $DATABASE_URL | sed -E 's|^postgres://[^@]+@([^:/]+).*|\1|')
PG_PORT=$(echo $DATABASE_URL | sed -E 's|^postgres://[^@]+@[^:/]+:([0-9]+).*|\1|')
PG_DATABASE=$(echo $DATABASE_URL | sed -E 's|^.*/([^/?]+).*|\1|')

# Check if BASE_URL is set
if [[ -z "$BASE_URL" ]]; then
  echo "❌ Error: BASE_URL is not set in .env!"
  exit 1
fi

# Prompt for user credentials
echo "🔑 Please log in to proceed."
read -p "Email: " USER_EMAIL
read -s -p "Password: " USER_PASSWORD
echo ""

# API login request
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$USER_EMAIL\", \"password\": \"$USER_PASSWORD\"}")

# Extract token and role from response
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
ROLE=$(echo "$LOGIN_RESPONSE" | jq -r '.user.role')

# Check authentication & admin status
if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "❌ Login failed! Please check your credentials."
  exit 1
fi

if [[ "$ROLE" != "admin" ]]; then
  echo "🚫 Access denied! Only admins can seed data."
  exit 1
fi

echo "✅ Login successful. Proceeding with data seeding..."

# Function to generate random grocery items
generate_grocery_item() {
  ITEM_NAMES=("Milk" "Bread" "Eggs" "Butter" "Cheese" "Rice" "Pasta" "Tomatoes" "Chicken" "Fish")
  NAME=${ITEM_NAMES[$RANDOM % ${#ITEM_NAMES[@]}]}
  PRICE=$(echo "scale=2; ($RANDOM % 100 + 1) + ($RANDOM % 100) / 100" | bc)
  INVENTORY=$(shuf -i 10-200 -n 1)
  echo "('$NAME', $PRICE, $INVENTORY)"
}

# Ask user how many random items to insert
read -p "How many grocery items to insert? " COUNT
if ! [[ "$COUNT" =~ ^[0-9]+$ ]]; then
  echo "❌ Error: Please enter a valid number!"
  exit 1
fi

# Construct INSERT query
INSERT_QUERY="INSERT INTO grocery_item (name, price, inventory) VALUES"
for ((i = 0; i < COUNT; i++)); do
  INSERT_QUERY+=" $(generate_grocery_item),"
done

# Remove last comma & add semicolon
INSERT_QUERY="${INSERT_QUERY%,};"

# Execute the query using psql
export PGPASSWORD="$PG_PASSWORD"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -c "$INSERT_QUERY"

# Confirm success
echo "✅ Successfully inserted $COUNT random grocery items!"
