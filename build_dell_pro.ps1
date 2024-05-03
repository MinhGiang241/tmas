npm run build
docker build -t prod -f Dockerfile.dell .
docker tag prod minhgiang241/tmas:product
docker push minhgiang241/tmas:product
