import torch
from diffusers import StableDiffusionXLPipeline, EulerDiscreteScheduler
import os
import uuid

# 配置参数
BASE_OUTPUT_DIR = "/Users/bytedance/项目库/AI音乐自媒体/账号运营材料_v1.0/图片/"
os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)

# 加载模型（使用RealVisXL V4.0真人质感模型）
model_id = "SG161222/RealVisXL_V4.0"
scheduler = EulerDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
pipe = StableDiffusionXLPipeline.from_pretrained(
    model_id,
    scheduler=scheduler,
    torch_dtype=torch.float16,
    use_safetensors=True,
    variant="fp16"
)
pipe = pipe.to("mps")  # 使用Apple Silicon GPU加速

# 紫紫酱核心特征Prompt
base_positive_prompt = """
photo of a 20-year-old Chinese girl named Zizijiang, 
oval face, soft jawline, almond eyes, slightly upturned eye corners, brown pupils, obvious under-eye bags,
natural curved eyebrows, light brown color, clear hair texture,
small and straight nose, round nose tip,
M-shaped lips, pink lip color, moderate thickness,
light brown medium-long hair, natural big waves, fluffy hair volume,
realistic skin texture, visible skin pores, natural skin glow,
soft natural lighting, 8k, ultra high resolution, photorealistic, highly detailed,
no AI artifacts, no plastic feeling, natural expression
"""

base_negative_prompt = """
ugly, deformed, disfigured, bad anatomy, extra limbs, missing limbs, floating limbs,
blurry, low resolution, grainy, noisy, overexposed, underexposed,
AI artifacts, plastic feeling, cartoon, anime, 3d render, illustration, painting,
watermark, text, logo, signature,
bad hands, bad fingers, extra fingers, missing fingers,
unnatural expression, creepy, weird
"""

# 头像生成任务
avatar_tasks = [
    {
        "name": "抖音头像_1:1",
        "size": (1024, 1024),
        "prompt_add": """
        chest-up close-up, head takes 70% of the frame,
        light purple gradient background, clean and simple,
        smile showing 8 teeth, bright eyes, energetic girl feeling
        """,
        "count": 1
    },
    {
        "name": "小红书头像_3:4",
        "size": (896, 1152),
        "prompt_add": """
        waist-up half body shot, head takes 50% of the frame,
        white minimalist background with light purple flower decorations,
        gentle smile, soft eyes, fresh and sweet style
        """,
        "count": 1
    },
    {
        "name": "B站头像_16:9",
        "size": (1344, 768),
        "prompt_add": """
        shoulder-up close-up, person centered slightly to the left, leave space on the right,
        music element background (musical notes, guitar), light purple tone,
        playful wink, energetic, lively二次元 style but realistic
        """,
        "count": 1
    }
]

# 封面图生成任务
cover_tasks = [
    {
        "name": "封面_音乐主题",
        "sizes": [(1344, 768), (896, 1152)],  # 16:9横版 + 3:4竖版
        "prompt_add": """
        in recording studio, holding microphone/guitar,
        wearing casual sweatshirt and jeans,
        focused singing expression,
        elements: mixing console, sheet music, stage lights,
        color tone: warm purple + beige
        """,
        "count": 1
    },
    {
        "name": "封面_日常主题",
        "sizes": [(1344, 768), (896, 1152)],
        "prompt_add": """
        in home/coffee shop environment,
        wearing loose sweater and pleated skirt,
        relaxed and natural expression, drinking milk tea/reading book,
        elements: coffee cup, book, green plants,
        color tone: warm orange + light purple
        """,
        "count": 1
    },
    {
        "name": "封面_舞台主题",
        "sizes": [(1344, 768), (896, 1152)],
        "prompt_add": """
        on concert stage,
        wearing sequin performance costume with stage makeup,
        energetic expression, singing and performing,
        elements: stage lights, smoke, audience seats,
        color tone: purple + blue + pink neon lights
        """,
        "count": 1
    },
    {
        "name": "封面_穿搭主题",
        "sizes": [(1344, 768), (896, 1152)],
        "prompt_add": """
        in fitting room/street,
        wearing sweet style outfit,
        confident smile, showing the outfit,
        elements: clothing items, mirror, street view,
        color tone: macaron color + light purple
        """,
        "count": 1
    },
    {
        "name": "封面_治愈主题",
        "sizes": [(1344, 768), (896, 1152)],
        "prompt_add": """
        outdoor grassland/seaside,
        wearing white dress and canvas shoes,
        gentle healing smile, looking into the distance,
        elements: flowers, sunlight, sea breeze,
        color tone: sky blue + light green + light purple
        """,
        "count": 1
    }
]

# 生成头像
print("开始生成头像...")
for task in avatar_tasks:
    print(f"生成 {task['name']}...")
    for i in range(task["count"]):
        prompt = base_positive_prompt + task["prompt_add"]
        negative_prompt = base_negative_prompt
        
        image = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=task["size"][0],
            height=task["size"][1],
            num_inference_steps=30,
            guidance_scale=7.5,
            generator=torch.Generator("mps").manual_seed(uuid.uuid4().int & 0xFFFFFFFF)
        ).images[0]
        
        filename = f"{task['name']}_{i+1}.png"
        save_path = os.path.join(BASE_OUTPUT_DIR, filename)
        image.save(save_path)
        print(f"已保存: {save_path}")

# 生成封面图
print("\n开始生成封面图...")
for task in cover_tasks:
    print(f"生成 {task['name']}...")
    for size in task["sizes"]:
        size_name = f"{size[0]}x{size[1]}"
        for i in range(task["count"]):
            prompt = base_positive_prompt + task["prompt_add"]
            negative_prompt = base_negative_prompt
            
            image = pipe(
                prompt=prompt,
                negative_prompt=negative_prompt,
                width=size[0],
                height=size[1],
                num_inference_steps=30,
                guidance_scale=7.5,
                generator=torch.Generator("mps").manual_seed(uuid.uuid4().int & 0xFFFFFFFF)
            ).images[0]
            
            filename = f"{task['name']}_{size_name}_{i+1}.png"
            save_path = os.path.join(BASE_OUTPUT_DIR, filename)
            image.save(save_path)
            print(f"已保存: {save_path}")

print("\n所有图片生成完成！")
print(f"保存目录: {BASE_OUTPUT_DIR}")
