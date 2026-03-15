import requests
from bs4 import BeautifulSoup
import random

USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
]

def get_headers():
    return {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
    }

url = "https://www.jjwxc.net/bookbase.php?bw=1&submit=&s_type=2&s=5&page=1"
response = requests.get(url, headers=get_headers())
response.encoding = 'gbk'  # 晋江使用GBK编码

print(f"状态码: {response.status_code}")
print(f"页面前1000字符:\n{response.text[:1000]}")

# 保存页面
with open('jjwxc_test.html', 'w', encoding='utf-8') as f:
    f.write(response.text)

print("\n页面已保存到 jjwxc_test.html")
