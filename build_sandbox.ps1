docker build -t tmassandbox -f Dockerfile.dev .
docker tag tmassandbox minhgiang241/tmas:sandbox
docker push minhgiang241/tmas:sandbox

