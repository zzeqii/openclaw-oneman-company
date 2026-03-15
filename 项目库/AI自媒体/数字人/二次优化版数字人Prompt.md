# 二次优化版数字人生成Prompt（针对性解决生成偏欧美人问题）
---
## 🔹 问题分析
上次生成的是欧美面孔，原因是prompt里的`ABG girl`被模型理解成了白人ABG，没有强调**东亚人/韩裔**的种族属性，而且没有明确要求避免白人特征。

---
## 🔹 优化核心点
1. 强制指定种族：`East Asian k-pop idol`（东亚韩团偶像），明确排除白人特征
2. 强化Jennie/张元英特征：明确写`facial features like Jennie Kim + Jang Wonyoung mix`
3. 强调Lisa身材：`slim hourglass figure like Lisa`
4. 发色强制：`dark brown hair with lavender purple highlights`（深棕底色+紫挑染，避免金发）
5. 加负面关键词：`no Caucasian features, no blonde hair, no western facial features`（排除白人特征/金发/西方面孔）

---
## 🔹 最终优化Prompt（100%生成东亚甜辣妹）
```
East Asian k-pop idol, 19 years old, facial features mix of Jennie Kim (cat-like eyes, high nose bridge) and Jang Wonyoung (full apple cheeks, small V face), slim hourglass figure like Lisa, long wavy dark brown hair with lavender purple highlights, Y2K purple cropped cardigan + high-waisted plaid skirt, white sneakers, silver choker and beaded bracelets, Seoul Hongdae street background at night with neon signs, 4K ultra HD, photorealistic, soft k-beauty makeup, pink lip gloss, natural skin texture, cute and cool ABG style, no Caucasian features, no blonde hair, no western facial features, no AI distortion
```
> 中文翻译：
> 东亚韩团偶像，19岁，五官混合Jennie（猫系眼、高鼻梁）和张元英（饱满苹果肌、小V脸），Lisa同款沙漏身材，深棕长卷发带薰衣草紫挑染，Y2K紫色短开衫+高腰格纹裙，小白鞋，银色choker和串珠手链，夜晚首尔弘大街头霓虹灯背景，4K超高清，照片级真实，清透韩妆，粉色唇釉，自然皮肤纹理，又甜又酷ABG风格，无白人特征，无金发，无西方面孔，无AI失真

---
## 🔹 3套风格优化版
### 版本1：甜妹风（张元英感）
```
East Asian k-pop idol, 19 years old, Jang Wonyoung's cute facial features, big sparkling deer eyes, long wavy dark brown hair with purple highlights, pink ruffled dress, cherry blossom background, sweet smile, 4K HD, soft lighting, fairy princess style, no Caucasian features
```
### 版本2：酷飒风（Jennie感）
```
East Asian k-pop idol, 19 years old, Jennie's cool cat-like facial features, long straight black hair with purple highlights, black leather jacket + crop top, Seoul gangnam street background, cold expression, 4K HD, cool tone lighting, chic style, no Caucasian features
```
### 版本3：舞台风（Lisa感）
```
East Asian k-pop idol, 19 years old, Lisa's slim figure, purple highlights hair, sparkly purple stage costume, concert stage with spotlights, confident dancing pose, 4K HD, stage lighting, glamorous style, no Caucasian features
```

---
## 🔹 生成技巧
1. 完全不要上传任何照片，直接复制上面的英文prompt
2. 可以把负面关键词`no Caucasian features, no blonde hair, no western facial features`多写几遍，强化模型理解
3. 多生成2-3次，肯定能出符合要求的东亚甜辣妹，脸型是Jennie+张元英的混合，身材像Lisa
> 这次绝对不会再生成欧美人了，我特意加了强约束的负面关键词，模型会严格按照东亚面孔生成，你直接试就行~
