import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def download_wiki_image(filename, save_as):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles=File:{filename}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read())
        pages = data['query']['pages']
        for page_id in pages:
            image_url = pages[page_id]['imageinfo'][0]['url']
            print(f"Downloading {image_url} to {save_as}")
            urllib.request.urlretrieve(image_url, save_as)
            return

try:
    # A beautiful monstera leaf PNG from Wikimedia Commons
    download_wiki_image('Monstera_deliciosa_leaf_3.png', 'leaf-left.png')
except Exception as e:
    print("Could not download Monstera:", e)

try:
    # A palm branch PNG from Wikimedia Commons (or a similar leaf)
    download_wiki_image('Palm_leaf_(transparent_background).png', 'leaf-right.png')
except Exception as e:
    print("Could not download Palm:", e)
    
