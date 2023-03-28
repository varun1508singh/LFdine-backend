# LFDine Backend Service

## How to set up?

- run `npm i`
- run `npm run start`
- The app should start on port `8080`

## How to set NFT metadata?

- Use the `/mint` path
- The path accepts an `image` and three other params `title`, `description` and `creator`
- example curl:

```
curl --location 'http://localhost:8080/mint' \
--form 'image=@"/Users/varun/Desktop/IMPORTANT DOCUMENTS/395277172 (1).jpg"' \
--form 'data="{\"title\": \"test\",\"description\": \"testing round 1\", \"creator\": \"varun singh\"} "'
```