FROM gcc:4.9

WORKDIR /code

CMD ["sh", "-c", "gcc program.c -o program && ./program"]
