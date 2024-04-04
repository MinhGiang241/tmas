docker build -t tmas -f Dockerfile.dev .
docker tag tmas minhgiang241/tmas:latest
docker push minhgiang241/tmas:latest
