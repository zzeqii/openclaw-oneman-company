import requests
from bs4 import BeautifulSoup
import json
import time
import random
import re
from urllib.parse import urljoin, urlparse
import os

# 配置
USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
]

# 请求头
def get_headers():
    return {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
    }

# 安全请求
def safe_request(url, max_retries=3, timeout=10):
    for i in range(max_retries):
        try:
            time.sleep(random.uniform(1, 3))
            response = requests.get(url, headers=get_headers(), timeout=timeout)
            response.encoding = response.apparent_encoding
            if response.status_code == 200:
                return response
            print(f"请求失败，状态码: {response.status_code}，重试 {i+1}/{max_retries}")
        except Exception as e:
            print(f"请求异常: {e}，重试 {i+1}/{max_retries}")
        time.sleep(random.uniform(2, 5))
    print(f"请求失败超过最大次数: {url}")
    return None

# 晋江文学城爬取
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
        print(f"正在爬取晋江: {lst['name']}")
        response = safe_request(lst["url"])
        if not response:
            continue
        
        response.encoding = 'gb18030'
        soup = BeautifulSoup(response.text, 'html.parser')
        rows = soup.select('table.cytable tr')
        count = 0
        
        for row in rows[1:]:  # 跳过表头
            if count >= 50:
                break
            
            try:
                cols = row.select('td')
                if len(cols) < 7:
                    continue
                
                book_link = cols[1].select_one('a')
                if not book_link:
                    continue
                
                book_url = urljoin(base_url, book_link['href'])
                title = book_link.get_text(strip=True)
                author = cols[0].select_one('a').get_text(strip=True) if cols[0].select_one('a') else ""
                genre = cols[2].get_text(strip=True)
                tags = cols[2].get_text(strip=True)
                print(f"找到书籍: {title} - {author} - {genre}")
                
                # 只爬取古代言情
                if "古代言情" not in genre and "古言" not in genre and "架空历史" not in genre:
                    continue
                
                # 获取详情页信息
                book_response = safe_request(book_url)
                if not book_response:
                    continue
                
                book_soup = BeautifulSoup(book_response.text, 'html.parser')
                summary = book_soup.select_one('#novelintro').get_text(strip=True) if book_soup.select_one('#novelintro') else ""
                
                # 提取核心卖点（前200字简介）
                core_sell = summary[:200] + "..." if len(summary) > 200 else summary
                
                # 提取评论
                comments = []
                comment_rows = book_soup.select('div.commentbody')
                for comment in comment_rows[:5]:  # 取前5条评论
                    comment_text = comment.get_text(strip=True)
                    if comment_text:
                        comments.append(comment_text[:100] + "..." if len(comment_text) > 100 else comment_text)
                
                results.append({
                    "platform": "晋江文学城",
                    "list_name": lst["name"],
                    "rank": count + 1,
                    "title": title,
                    "author": author,
                    "tags": tags,
                    "core_sell": core_sell,
                    "comments": comments
                })
                count += 1
                
            except Exception as e:
                print(f"解析晋江书籍失败: {e}")
                continue
    
    return results

# 起点女生网爬取
def crawl_qidian_girl():
    base_url = "https://www.qidian.com/mm/"
    lists = [
        {"name": "新晋作家榜", "url": "https://www.qidian.com/mm/rank/newauthor/"},
        {"name": "VIP热销榜", "url": "https://www.qidian.com/mm/rank/vip/"},
        {"name": "编辑推荐榜", "url": "https://www.qidian.com/mm/rank/recom/"},
        {"name": "月票榜", "url": "https://www.qidian.com/mm/rank/monthticket/"},
        {"name": "季票榜", "url": "https://www.qidian.com/mm/rank/quarterticket/"},
        {"name": "月票年榜", "url": "https://www.qidian.com/mm/rank/yearticket/"}
    ]
    
    results = []
    for lst in lists:
        print(f"正在爬取起点女生网: {lst['name']}")
        response = safe_request(lst["url"])
        if not response:
            continue
        
        soup = BeautifulSoup(response.text, 'html.parser')
        items = soup.select('div.rank-list-wrap table tbody tr')
        count = 0
        
        for item in items:
            if count >= 50:
                break
            
            try:
                book_link = item.select_one('td.name a')
                if not book_link:
                    continue
                
                book_url = urljoin(base_url, book_link['href'])
                title = book_link.get_text(strip=True)
                author = item.select_one('td.author a').get_text(strip=True) if item.select_one('td.author a') else ""
                tags = item.select_one('td.type a').get_text(strip=True) if item.select_one('td.type a') else ""
                genre = item.select_one('td.cate a').get_text(strip=True) if item.select_one('td.cate a') else ""
                
                # 只爬取古代言情
                # if "古代言情" not in genre and "古言" not in genre:
                #     continue
                
                # 获取详情页信息
                book_response = safe_request(book_url)
                if not book_response:
                    continue
                
                book_soup = BeautifulSoup(book_response.text, 'html.parser')
                summary = book_soup.select_one('div.book-intro p').get_text(strip=True) if book_soup.select_one('div.book-intro p') else ""
                
                # 提取核心卖点
                core_sell = summary[:200] + "..." if len(summary) > 200 else summary
                
                # 提取评论
                comments = []
                comment_section = book_soup.select('div.comment-item-content p')
                for comment in comment_section[:5]:
                    comment_text = comment.get_text(strip=True)
                    if comment_text:
                        comments.append(comment_text[:100] + "..." if len(comment_text) > 100 else comment_text)
                
                results.append({
                    "platform": "起点女生网",
                    "list_name": lst["name"],
                    "rank": count + 1,
                    "title": title,
                    "author": author,
                    "tags": tags,
                    "core_sell": core_sell,
                    "comments": comments
                })
                count += 1
                
            except Exception as e:
                print(f"解析起点书籍失败: {e}")
                continue
    
    return results

# 番茄小说爬取
def crawl_fanqie():
    base_url = "https://fanqienovel.com/"
    # 番茄小说榜单页面
    lists = [
        {"name": "古代言情-热门榜", "url": "https://fanqienovel.com/category/656/hot"},
        {"name": "古代言情-新书榜", "url": "https://fanqienovel.com/category/656/new"},
        {"name": "古代言情-好评榜", "url": "https://fanqienovel.com/category/656/positive"},
        {"name": "古代言情-完结榜", "url": "https://fanqienovel.com/category/656/end"},
    ]
    
    results = []
    for lst in lists:
        print(f"正在爬取番茄小说: {lst['name']}")
        response = safe_request(lst["url"])
        if not response:
            continue
        
        try:
            soup = BeautifulSoup(response.text, 'html.parser')
            books = soup.select('div.book-item')
            count = 0
            
            for book in books:
                if count >= 50:
                    break
                
                try:
                    book_link = book.select_one('a.book-name')
                    if not book_link:
                        continue
                    
                    book_url = urljoin(base_url, book_link['href'])
                    title = book_link.get_text(strip=True)
                    author = book.select_one('div.author').get_text(strip=True) if book.select_one('div.author') else ""
                    tags_str = book.select_one('div.tags').get_text(strip=True) if book.select_one('div.tags') else ""
                    book_response = safe_request(book_url)
                    if not book_response:
                        continue
                    
                    book_soup = BeautifulSoup(book_response.text, 'html.parser')
                    summary = book_soup.select_one('div.abstract').get_text(strip=True) if book_soup.select_one('div.abstract') else ""
                    
                    # 提取核心卖点
                    core_sell = summary[:200] + "..." if len(summary) > 200 else summary
                    
                    # 提取评论
                    comments = []
                    comment_items = book_soup.select('div.comment-content')
                    for comment in comment_items[:5]:
                        comment_text = comment.get_text(strip=True)
                        if comment_text:
                            comments.append(comment_text[:100] + "..." if len(comment_text) > 100 else comment_text)
                    
                    results.append({
                        "platform": "番茄小说",
                        "list_name": lst["name"],
                        "rank": count + 1,
                        "title": title,
                        "author": author,
                        "tags": tags_str,
                        "core_sell": core_sell,
                        "comments": comments
                    })
                    count += 1
                    
                except Exception as e:
                    print(f"解析番茄书籍失败: {e}")
                    continue
            
        except Exception as e:
            print(f"解析番茄榜单失败: {e}")
            continue
    
    return results

# 保存为Markdown
def save_to_markdown(data, output_path):
    # 创建目录
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    content = "# 古代言情小说知识库 v1.0\n\n"
    content += "## 数据概览\n"
    content += f"- 爬取时间: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    content += f"- 总条目数: {len(data)}\n"
    content += "- 覆盖平台: 晋江文学城、起点女生网、番茄小说\n"
    content += "- 覆盖榜单: 新晋、VIP、编辑推荐、月榜、季榜、年榜\n\n"
    
    # 按平台分类
    platforms = ["晋江文学城", "起点女生网", "番茄小说"]
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
                if book["comments"]:
                    content += "- **读者评论**:\n"
                    for i, comment in enumerate(book["comments"], 1):
                        content += f"  {i}. {comment}\n"
                content += "\n"
    
    # 写入文件
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"文件已保存到: {output_path}")

if __name__ == "__main__":
    print("开始爬取古言小说榜单...")
    
    # 爬取各平台
    jj_data = crawl_jjwxc()
    print(f"晋江爬取完成，共 {len(jj_data)} 条数据")
    
    qidian_data = crawl_qidian_girl()
    print(f"起点女生网爬取完成，共 {len(qidian_data)} 条数据")
    
    fanqie_data = crawl_fanqie()
    print(f"番茄小说爬取完成，共 {len(fanqie_data)} 条数据")
    
    # 合并数据
    all_data = jj_data + qidian_data + fanqie_data
    
    # 保存
    output_path = "/Users/bytedance/.openclaw/workspace/古言知识库_v1.0.md"
    save_to_markdown(all_data, output_path)
    
    print("爬取完成！")
