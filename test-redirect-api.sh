#!/bin/bash

# Test script for redirect API

echo "==================================="
echo "Redirect Checker API Test Suite"
echo "==================================="
echo ""

API_URL="http://localhost:3002/api/redirectcheck"

# Test 1: Simple HTTPS site (no redirect)
echo "Test 1: Simple HTTPS site (example.com)"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{"url": "https://example.com"}' \
  | jq '.[] | {url, status, ssl: .ssl.valid, security: .security.score, seo: .seo.impactScore}'
echo ""

# Test 2: Site with redirect
echo "Test 2: Site with redirect (http://github.com -> https://github.com)"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{"url": "http://github.com"}' \
  | jq '.[] | {url, status, location, redirectType}'
echo ""

# Test 3: Check headers extraction
echo "Test 3: Headers extraction test"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{"url": "https://www.cloudflare.com"}' \
  | jq '.[].headers | keys | length'
echo ""

echo "==================================="
echo "Tests completed!"
echo "==================================="
