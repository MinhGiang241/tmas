npm run build
docker build -t tmas -f Dockerfile.dell .
docker tag tmas minhgiang241/tmas:latest
docker push minhgiang241/tmas:latest
