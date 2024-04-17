# NFT Wash Trading 

An unofficial code implementation of the paper "NFT Wash Trading Quantifying suspicious behaviour in NFT markets".


Each NFT is represented as a graph, with nodes representing addresses and edges representing transactions. 

Records of transfers or sales form a directed graph.

The complexity of detecting and extracting cycles is O((N+E)(c+1)), where (N) represents the number of nodes, (E) represents the number of edges, and (c) represents the number of cycles in the graph.

**The example data is powered by [NFTGo](https://nftgo.io). If you need more data, you can obtain an API-KEY by visiting [this page](https://nftgo.io/developers), import it into the .env file, and run `python crawl_nft_data.py -tx`.**


## Usage

1. unzip nft_data.zip
2. run `node detect.js`

## References

1. NFT Wash Trading - Quantifying suspicious behaviour in NFT markets: https://arxiv.org/pdf/2202.03866.pdf
2. Detect Cycle in Directed Graph Algorithm: https://www.youtube.com/watch?v=rKQaZuoUR4M