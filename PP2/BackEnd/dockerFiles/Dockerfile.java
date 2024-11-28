FROM openjdk:11-slim

WORKDIR /code

CMD ["sh", "-c", "javac Main.java && java Main"]
