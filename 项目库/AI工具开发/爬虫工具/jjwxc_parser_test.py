from bs4 import BeautifulSoup

# 读取测试页面
with open('jjwxc_test.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# 查找表格
tables = soup.select('table')
print(f"找到 {len(tables)} 个表格")

for i, table in enumerate(tables):
    rows = table.select('tr')
    print(f"表格 {i} 有 {len(rows)} 行")
    if len(rows) > 0:
        print(f"第一行内容: {rows[0].get_text(strip=True)[:100]}")

# 尝试查找cytable
cytable = soup.select_one('table.cytable')
if cytable:
    print("\n找到cytable表格")
    rows = cytable.select('tr')
    print(f"共 {len(rows)} 行")
    for i, row in enumerate(rows[:5]):  # 前5行
        cols = row.select('td')
        print(f"行 {i} 有 {len(cols)} 列")
        for j, col in enumerate(cols):
            text = col.get_text(strip=True)
            if text:
                print(f"  列 {j}: {text[:50]}")
else:
    print("\n未找到cytable表格")
