docker build -t shamirj/smarthotel-client:latest -t shamirj/smarthotel-client:$SHA -f ./smarthotel-client/Dockerfile ./smarthotel-client
docker build -t shamirj/smarthotel-server:latest -t shamirj/smarthotel-server:$SHA -f ./smarthotel-server/Dockerfile ./smarthotel-server
docker build -t shamirj/smarthotel-qrcode:latest -t shamirj/smarthotel-qrcode:$SHA -f ./smarthotel-qrcode/Dockerfile ./smarthotel-qrcode
# docker build -t shamirj/smarthotel-qrcode:latest -t shamirj/smarthotel-qrcode:$SHA -f ./smarthotel-qrcode/Dockerfile ./smarthotel-qrcode

docker push shamirj/smarthotel-client:latest
docker push shamirj/smarthotel-server:latest
docker push shamirj/smarthotel-qrcode:latest
# docker push shamirj/smarthotel-qrcode:latest

docker push shamirj/smarthotel-client:$SHA
docker push shamirj/smarthotel-server:$SHA
docker push shamirj/smarthotel-qrcode:$SHA
# docker push shamirj/smarthotel-qrcode:$SHA

# kubectl apply -f k8s
# kubectl set image deployments/smarthotel-server-deployment smarthotel-server=shamirj/smarthotel-server:$SHA
# kubectl set image deployments/smarthotel-client-deployment smarthotel-client=shamirj/smarthotel-client:$SHA
# kubectl set image deployments/smarthotel-qrcode-deployment smarthotel-qrcode=shamirj/smarthotel-qrcode:$SHA
