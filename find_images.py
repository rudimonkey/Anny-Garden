import requests
import re
import sys

def search_unsplash_ids(query):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    url = f"https://www.google.com/search?q=site:unsplash.com+{query}+photo-1"
    response = requests.get(url, headers=headers)
    # Look for patterns like photo-1596541223130-5d31a73fb6c6
    ids = re.findall(r'photo-([0-9a-fA-F-]+)', response.text)
    # Filter for long IDs (usually have many digits and a dash)
    long_ids = [i for i in ids if len(i) > 15]
    return list(set(long_ids))

if __name__ == "__main__":
    query = sys.argv[1]
    ids = search_unsplash_ids(query)
    for i in ids:
        print(f"photo-{i}")
