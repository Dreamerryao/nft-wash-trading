from dotenv import load_dotenv
import requests
import os
import csv
import json
import argparse


load_dotenv()
api_key = os.getenv("API-KEY")
headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "X-API-KEY": api_key,
}

def do_collection_transaction_history_job(row):
    address = row["address"]
    symbol = row["symbol"]
    total_supply = row["totalSupply"]
    start_time = row["createTime"]
    end_time = row["endTime"]
    limit = 100
    current_cursor = ""
    
    # 0 - 9999
    for i in range(0,int(total_supply)):
        res_data = []
        init_url = f"https://data-api.nftgo.io/eth/v2/history/nft/transactions?contract_address={address}&token_id={i}&action=sale%2Ctransfer&start_time={start_time}&end_time={end_time}&exclude_wash_trading=false&offset=0&limit={limit}"
        response = requests.get(init_url, headers=headers)
        
        data = response.json()
        res_data = data["transactions"]
        total = data["total"]
        current_cursor = data["next_cursor"]
        print(i,total)
        offset = limit
        while current_cursor != "":
            url = f"https://data-api.nftgo.io/eth/v2/history/nft/transactions?contract_address={address}&token_id={i}&action=sale%2Ctransfer&start_time={start_time}&end_time={end_time}&exclude_wash_trading=false&cursor={current_cursor}"
            response = requests.get(url, headers=headers)
            data = response.json()
            res_data.extend(data["transactions"])
            offset += limit
            current_cursor = data["next_cursor"]
        with open(f"nft_data/{symbol}_{i}.json", "w") as file:
            json.dump(res_data, file)



parser = argparse.ArgumentParser(description="Crawl collection data.")
parser.add_argument("-tx", action="store_true", help="Execute the transaction history job")

args = parser.parse_args()

with open("collection.csv", mode="r") as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        if args.tx:
            do_collection_transaction_history_job(row)
