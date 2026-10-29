"""Regenerate the committed sharing card with Pillow (not part of npm builds).
Run: python3 scripts/create-social-card.py --font /path/to/bold.ttf
The framework logo is used unchanged; no external service or font is fetched.
"""
from pathlib import Path
import argparse
from PIL import Image, ImageDraw, ImageFont
parser = argparse.ArgumentParser()
parser.add_argument('--font', default='/usr/share/fonts/google-carlito-fonts/Carlito-Bold.ttf')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
card = Image.new('RGB', (1200, 630), '#101517')
draw = ImageDraw.Draw(card)
draw.rounded_rectangle((28, 28, 1172, 602), radius=24, outline='#2b3736', width=2)
draw.line((75, 112, 175, 112), fill='#8ae6c2', width=5)
font=lambda size: ImageFont.truetype(args.font, size)
draw.text((75, 145), 'CopyTyGo', font=font(88), fill='#eef4f1')
draw.text((78, 265), 'Full-stack Go + TypeScript', font=font(46), fill='#8ae6c2')
draw.text((78, 345), 'Build applications. Stay close to your code.', font=font(27), fill='#a3b4ae')
draw.text((78, 489), 'DOCUMENTATION  /  V5', font=font(23), fill='#a3b4ae')
draw.text((78, 535), 'copytygo.org', font=font(28), fill='#eef4f1')
logo=Image.open(root/'public/logo.png').convert('RGBA')
logo.thumbnail((290,290), Image.Resampling.LANCZOS)
card.paste(logo,(830,175),logo)
card.save(root/'public/og-image.png', optimize=True)
print('Created public/og-image.png (1200 x 630)')
icon = Image.new('RGBA', (96, 96), (0, 0, 0, 0))
logo = Image.open(root/'public/logo.png').convert('RGBA')
logo.thumbnail((88, 88), Image.Resampling.LANCZOS)
icon.paste(logo, ((96-logo.width)//2, (96-logo.height)//2), logo)
icon.save(root/'public/favicon.png', optimize=True)
print('Created public/favicon.png (96 x 96)')
