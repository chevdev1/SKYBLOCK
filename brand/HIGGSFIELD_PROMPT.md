# Higgsfield: эталоны и промт для сцены «герой прыгает по облачкам, за ним Кумо»

Все эталоны сняты **из самой игры** (`play/`), а не с лендинга, и без интерфейса. Папка: `brand/refs-game/`.

## Какие эталоны подавать

| Файл | Что это | Как использовать |
|---|---|---|
| `02-hero-jump-from-behind.jpg` | герой в прыжке со спины на островах | **стартовый кадр** (start frame) для image-to-video: задаёт ракурс, свет и стиль |
| `01-hero-front.png` | герой Рыжик анфас: рыжая кепка, голубая рубашка, коричневый пояс, белые ноги и красные ботинки | референс персонажа (character reference / element) |
| `05-kumo-in-game.png` | Кумо из игры: белый кубический «облачный» зверёк, чёрные квадратные глаза с бликом, розовые щёчки | референс второго персонажа. Он мягкий по резкости (карточка в игре маленькая), поэтому в промте подробно описана внешность |
| `03-world-style-islands.jpg`, `04-world-style-start.jpg` | острова, деревья, трава, цветы | референс стиля и окружения (style reference) |
| `06-hero-npc-scene-2000.jpg` | широкая сцена с героем и NPC | запасной стартовый кадр, если нужен ракурс анфас |

Если модель принимает несколько референсов: стартовый кадр `02`, плюс `01` и `05` как персонажи, плюс `03` как стиль. Если только один: подавайте `02`, а остальное описывайте словами (промт ниже это делает).

## Основной промт (клип 8 секунд, 16:9)

```
Stylized 3D cartoon, Minecraft-like voxel world with pixelated block textures, exactly matching the reference game look. A small blocky voxel hero with an orange-yellow block cap, light blue shirt, brown belt, white legs and red boots hops rhythmically from one floating grass island to the next, over a sea of fluffy white blocky clouds. Third-person chase camera from behind and slightly above. Right behind him a small white blocky cloud-bunny creature named Kumo (cube-shaped fluffy body, two black square eyes with a tiny white highlight, pink blush cheeks, tiny feet) bounces after him one beat behind, in sync. Five hops, each one higher and faster, the last one a big leap upward. On every landing: small puffs of cloud dust and pink flower petals. Warm golden-hour sunset light, soft pink and yellow sky, gentle bloom glow, god-rays. Smooth cinematic follow camera with slight energy, gentle push-in on the final jump. Keep the blocky voxel shapes and pixelated textures sharp, characters keep the exact same proportions and colors in every frame.
```

**Негатив (если есть поле):**

```
no text, no UI, no HUD, no logo, no realistic human, no extra characters, no morphing or melting of characters, no smooth rounded organic shapes, no change of outfit or colors, no camera cut
```

## Три продолжения в тот же трейлер (каждый 5–6 секунд)

**Кумо догоняет (крупный план):**
```
Close-up, low angle: the small white blocky cloud-bunny Kumo lands on a floating voxel island and bounces forward, long ears flopping, blush cheeks, black square eyes shining; behind it a blocky hero hops away into a sunset sky full of floating islands. Stylized 3D cartoon, voxel pixel textures, warm golden light, soft depth of field.
```

**Мега-прыжок вверх:**
```
The blocky voxel hero makes a huge final leap off a floating island, camera follows and tilts up to reveal a golden temple glowing at the top of the sky in a god-ray beam, a white blocky cloud-bunny jumping right behind him. Stylized 3D cartoon, voxel pixel textures, sunset bloom, epic but cute.
```

**Золотые крылья:**
```
In mid-air the blocky voxel hero unfolds golden blocky wings and glides through bright clouds, small white cloud-bunny creature riding on his shoulder, sun rays, smooth motion, joyful. Stylized 3D cartoon, voxel pixel textures.
```

## Советы, чтобы персонаж не «плыл»

1. Всегда стартуйте с кадра из игры (`02`), а не с текста.
2. Клип 4–8 секунд, один план, без склеек внутри.
3. Не просите текст и логотип. Название и «Открытый альфа-тест» ставим в монтаже.
4. Если герой поменял одежду или цвет, генерируйте заново с тем же стартовым кадром и добавьте в промт «keep the exact outfit from the reference».
5. Делайте 2–3 попытки и выбирайте лучшую.

## Что я не смог проверить

- Я не вижу вашего Higgsfield-аккаунта и интерфейса MCP: точные названия полей («start frame», «element», «reference») могут отличаться, ориентируйтесь на смысл.
- Резкий эталон Кумо можно снять напрямую в игре, но это отдельная операция (нужно получить Кумо в сохранении). Сделаю, если качество Кумо в клипе окажется недостаточным.
