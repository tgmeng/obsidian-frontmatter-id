# Obsidian Frontmatter ID Plugin

在笔记的 frontmatter 上自动生成 id 的 [Obsidian](https://obsidian.md) 插件.

## 使用

1. 新建笔记，会自动在 frontmatter 中插入 id
2. 通过 `Generate frontmatter id` 命令为当前笔记生成 id

## 配置

- name：生成的 frontmatter key 名, 默认为 `id`
- version：生成 id 使用的算法版本，默认为 `v7`
- exclude：某些文件夹的笔记不需要生成 id（比如各种模板文件），通过改选项可以排除这些文件夹
