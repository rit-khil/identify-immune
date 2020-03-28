
# Copy Files
aws s3 cp index.html s3://identify-immune-www/ --acl public-read
aws s3 cp team.html s3://identify-immune-www/ --acl public-read
aws s3 cp error.html s3://identify-immune-www/ --acl public-read
aws s3 cp success.html s3://identify-immune-www/ --acl public-read
aws s3 cp identify-immune.js s3://identify-immune-www/ --acl public-read
aws s3 cp data-states.csv s3://identify-immune-www/ --acl public-read
aws s3 cp map-city.csv s3://identify-immune-www/ --acl public-read
aws s3 cp logo.png s3://identify-immune-www/ --acl public-read


# Invalidate cloudfront
aws cloudfront create-invalidation --distribution-id E382EUS5SP9ZAI --paths "/index.html"
aws cloudfront create-invalidation --distribution-id E382EUS5SP9ZAI --paths "/success.html"
aws cloudfront create-invalidation --distribution-id E382EUS5SP9ZAI --paths "/error.html"
aws cloudfront create-invalidation --distribution-id E382EUS5SP9ZAI --paths "/team.html"
aws cloudfront create-invalidation --distribution-id E382EUS5SP9ZAI --paths "/identify-immune.js"
aws cloudfront create-invalidation --distribution-id E382EUS5SP9ZAI --paths "/team.html"
