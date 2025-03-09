FROM debian:bookworm-slim

ENV TZ=Asia/Tokyo

RUN groupadd -g 1001 owl
RUN useradd -m -g 1001 -u 1001 owl
USER owl
RUN mkdir -p /home/owl/dev
WORKDIR /home/owl/dev
