FROM gcc:4.9

WORKDIR /code

CMD ["sh", "-c", "g++ program.cpp -o program && ./program"]
