import requests
from bs4 import BeautifulSoup
import random
import time
import os

USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
]

def get_headers():
    return {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8',
    }

def crawl_jjwxc():
    base_url = "https://www.jjwxc.net/"
    lists = [
        {"name": "新晋作者榜", "url": "https://www.jjwxc.net/bookbase.php?bw=1&submit=&s_type=2&s=5&page=1"},
        {"name": "VIP强推榜", "url": "https://www.jjwxc.net/bookbase.php?bw=1&submit=&s_type=2&s=1&page=1"},
        {"name": "编辑推荐榜", "url": "https://www.jjwxc.net/bookbase.php?bw=1&submit=&s_type=2&s=12&page=1"},
        {"name": "月榜", "url": "https://www.jjwxc.net/bookbase.php?bw=1&submit=&s_type=2&s=2&page=1"},
        {"name": "季榜", "url": "https://www.jjwxc.net/bookbase.php?bw=1&submit=&s_type=2&s=3&page=1"},
        {"name": "年榜", "url": "https://www.jjwxc.net/bookbase.php?bw=1&submit=&s_type=2&s=4&page=1"}
    ]
    
    results = []
    for lst in lists:
        print(f"\n正在爬取晋江: {lst['name']}")
        try:
            response = requests.get(lst["url"], headers=get_headers(), timeout=10)
            response.encoding = 'gb18030'
            if response.status_code != 200:
                print(f"请求失败，状态码: {response.status_code}")
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            rows = soup.select('table.cytable tr')
            count = 0
            
            for row in rows[1:]:  # 跳过表头
                if count >= 10:  # 先爬10本测试
                    break
                
                try:
                    cols = row.select('td')
                    if len(cols) < 7:
                        continue
                    
                    book_link = cols[1].select_one('a')
                    if not book_link:
                        continue
                    
                    title = book_link.get_text(strip=True)
                    author = cols[0].select_one('a').get_text(strip=True) if cols[0].select_one('a') else ""
                    genre = cols[2].get_text(strip=True)
                    
                    # 只爬取古代相关
                    if "古代" not in genre and "架空" not in genre and "古言" not in genre:
                        continue
                    
                    print(f"  {count+1}. {title} - {author}")
                    
                    results.append({
                        "platform": "晋江文学城",
                        "list_name": lst["name"],
                        "rank": count + 1,
                        "title": title,
                        "author": author,
                        "tags": genre,
                        "core_sell": genre,
                        "comments": []
                    })
                    count += 1
                    
                except Exception as e:
                    print(f"  解析失败: {e}")
                    continue
            
            print(f"  爬取完成，共 {count} 本古言")
            
        except Exception as e:
            print(f"爬取榜单失败: {e}")
            continue
    
    return results

def save_to_markdown(data, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    content = "# 古代言情小说知识库 v1.0\n\n"
    content += "## 数据概览\n"
    content += f"- 爬取时间: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    content += f"- 总条目数: {len(data)}\n"
    content += "- 覆盖平台: 晋江文学城（测试版）\n"
    content += "- 覆盖榜单: 新晋、VIP、编辑推荐、月榜、季榜、年榜\n\n"
    
    # 按平台分类
    platforms = ["晋江文学城"]
    for platform in platforms:
        content += f"## {platform}\n\n"
        platform_data = [item for item in data if item["platform"] == platform]
        
        if not platform_data:
            content += "暂无数据\n\n"
            continue
        
        # 按榜单分类
        list_names = list(set([item["list_name"] for item in platform_data]))
        for list_name in list_names:
            content += f"### {list_name}\n\n"
            list_data = [item for item in platform_data if item["list_name"] == list_name]
            list_data.sort(key=lambda x: x["rank"])
            
            for book in list_data:
                content += f"#### {book['rank']}. {book['title']}\n"
                content += f"- **作者**: {book['author']}\n"
                content += f"- **标签**: {book['tags']}\n"
                content += f"- **核心卖点**: {book['core_sell']}\n"
                content += "\n"
    
    # 写入文件
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n文件已保存到: {output_path}")

if __name__ == "__main__":
    print("开始爬取晋江古言榜单...")
    data = crawl_jjwxc()
    print(f"\n总爬取数量: {len(data)} 本")
    output_path = "/Users/bytedance/.openclaw/workspace/古言知识库_v1.0.md"
    save_to_markdown(data, output_path)
    print("完成！")
