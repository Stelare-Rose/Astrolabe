---
type: astrolabe
title: "Pyxis and Horologium: Getting Distracted by the cool shiny thing"
description: Being a first-time developer, choosing a "shiny and new" toy, not checking what it's for, and finally, ending up rewriting the thing anyway. Also, a postmortem (kinda) on Pyxis.
publish: 2026-11-08
slug: pyxis-and-horologium-getting-distracted-by-the-cool-shiny-thing
tags:
draft: false
topics:
  - Horologium
  - Pyxis
  - Opinion
  - Learning
---
## Pyxis
Pyxis was my first project ever. It was supposed to be a simple to-do list app that ended up morphing into something way beyond what its original scope was. The main focus on this article however isn't actually anything specific to what Pyxis is, but it's how Pyxis was made.

Technically, Pyxis *wasn't* my first project. I had classwork before then that could be considered "My first project", and before then I had dabbled in some Unity 2D. However, I call Pyxis my first "real project" because it's the first time I had the freedom to choose not just what I wanted to make, but *how* I wanted to make it. The desktop framework, the web framework (Since I was using a desktop framework that wrapped a webview), the backend framework and language, these things were suddenly all a choice I had to make, and **there were options**. Recently there is just an abundance of choice for software developers. Back at the start of the project, the ones seriously being considered were things like Electron or Tauri for the desktop, and React, Vue, Next.js, or Nuxt for my web framework. Was there any real thing I understood about these? Nope. Not really. This story is about what I *wish* I knew, and what would've saved me some time.

## I wrote it in Tauri, Nuxt, and Go.
On the surface, the stack *isn't that bad*. Tauri itself is an Electron alternative written in Rust, and as I use NixOS *(btw)* and eventually wanted to package my app for myself, Tauri was genuinely not a bad choice because it's significantly easier to package compared to Electron. However, the reason I chose Tauri wasn't because of an informed decision. No, I chose it because it was the shiny new option and I wanted to be *alternative*. It was also said to be fast and efficient, so I took it. Sheer luck and happenstance is the reason that it ended up being a *pretty good* choice.

And then there's... the weird one. Nuxt on Tauri. Technically this also isn't *that bad*. Nuxt is supported and listed as one of the choices you can use in Tauri's own guide, but using a primarily SSR framework that's largely focused on SSR developer ergonomics in a desktop app is... *questionable*. It's not a bad framework by any means. I quite enjoyed using it for other projects later down the line, I just found that for this one it was largely inappropriate. I ended up basically just using Vue. Why did I choose this one? Well I was actually just finishing up some campus work on React and the promise of "Auto-import without being declared in the file" interested me. The only reason I chose Nuxt was because of a feature that is solved by basically installing a proper LSP.

Go was actually chosen for a decent reason- which is a surprise to me, looking back today. Go was already known as a language that was fast to iterate on, doesn't get in your way, and yet as a compiled language, it was a fast and efficient language. Something I was looking for, because I was looking to write something that can quietly run in the background and not be noticed. But, Go itself wasn't without problems. I often found these in the exact "doesn't get in your way" style of Go. This one time I was just actually staring at my code trying to figure out what happens when a file operation breaks. This potential bug, by the way, *never happened*. In my whole year of using Pyxis now, I've never had that specific file operation fail, and I have no idea what the ramifications of it failing would be. (Testing it was also unfeasible, because it was a weird race condition where an operation wouldn't finish in time as a filesystem operation fails).

## Horologium, My Second Project (kinda)
Horologium is what I'm currently working on. For an intro, see [Overthinking my data model](https://astrolabe.starrytea.cc/blog/horologium-overthinking-my-data-model-for-a-time-tracker/). I'm here to discuss the stack I chose. So, Horologium is being written in Tauri and Svelte. Svelte feels a lot better since it's actually built as a compiler, so the ergonomics of it are far more aligned with what I'm looking for. The fact it compiles to just plain JavaScript and the reactivity just kinda *works* has made my life a lot better. I haven't gotten deep enough into the project to speak more on it, but it's been a totally different experience from Nuxt.

And then, the service. Go functioned fine, sure, but I found myself overthinking edge cases, worrying about random race conditions, and worrying about things like whether I properly handled every case. So, I was looking for a language that would fit the following criteria
- **A language that would watch my back**  
	I'm looking for something that would help me reduce errors and unforeseen conditions in my project. As I'm relatively new to this whole "Development" thing, I found this to be a very important thing.
- **A Project that I could finish**  
	I was hoping that whatever language I chose, I could one day say that my project is "Done", and never touch it again. Most projects need maintenance. As a solo developer, I do intend on *not doing that if possible*, so I wanted something that was stable, with a language committed to stability.
Based on those two, true to the meme that's been going around developer circles, I ended up writing the service for Horologium in... Rust. And also I decided to rewrite Pyxis in Rust later down the line. Rust itself has been a blast to use now that I'm used to it, and I've been quite a big fan.

I will be honest however, Rust isn't a perfect language. I had some things that were bothering me too. The biggest one was that Rust itself is incredibly difficult to get started with. I was incredibly confused at the start especially with the ADT system. "Okay so... I want to use this... Result...? How do I do that?" and "Wait so I can't use ? because it's not a Result type? So I have to return a Result of an Option?" came up quite a lot. Rust also forced me to do a lot of designing upfront, which depending on the type of person you are, is a good thing or a bad thing. For me, I quite enjoyed the change. Finally, there's a lot more time between "Start" and "First Test", so I wouldn't really use this for prototyping ideas. Where using Go I finished Pyxis' prototype in a couple weeks, Horologium's shared library has already taken around a month.

But to me, that's... Fine. Particularly the last one, because while Go got me to prototype faster, Rust has felt to me like more real progress. When developing Pyxis, I was constantly running back to check if I had missed anything, making sure that everything was right, and sometimes anxiously looking at my code and asking "Is this really okay?". And that's just... who I am.

I guess I'm a developer who overthinks quite a lot, so choosing a language that I could trust meant that "50% done" actually felt like 50% done.
## What I wish I knew beforehand, and What I know now.
Before Pyxis, I had no idea what framework or language to use. Mostly, I kept hearing a mix of "It doesn't matter" or "You have to carefully consider the ecosystem, performance, and usage". I don't think either of these are wrong per se, but I do wish I knew back then what actually mattered and what doesn't, because from what I understand now, it's very much a mix.

I think Developer Experience matters, but it's within the context of what the tool is for. For example, Nuxt being chosen for auto-imports alone is fine if you needed a web framework. As a Tauri framework however, where what you needed was fundamentally an SSG or at most a client-rendered framework, it was a tad bit finicky. Golang was great for iteration and idea testing, but my experience with Rust has also shown me how nice it is to have a project I can call "done", with steps I can truly mark off as "complete". And this blog, written in Astro, would not have been this easy to write had I used an inappropriate framework.

So, what do I wish I knew before? I wish I knew the things I could've only gotten by experiencing it firsthand. I wish I knew how much developer experience was worth, and I wish I knew that using a tool not built for something affects your developer experience too. I wish I knew to think of project maintenance and odd edge cases, or development pipelines and compile-time checking.

It's a bit of a cop-out ending huh? My conclusion kinda does boil down to "I wish I had more experience".

But honestly I think there are two types of people going into this article. People who know what they're doing, and people who have just gotten started and are looking for what framework to learn. For the former, this article was never going to sway you. For the latter, I hope this article has been a story in why "It doesn't matter" is kind of wrong, but also kind of right. In the end, the conclusion I'd want to draw from this is that sometimes, **starting is the most important part**.

## Author's Notes
My first **opinion** piece! Hopefully I don't get burned at the stake for this. In all seriousness, this was a lot harder to write than the previous post, since this one actually requires me to state something I believe, making arguments for why I believe those things. Fun fact! This is practice for the upcoming Nix post I will be writing, because everyone who's used Nix and has a blog probably also quacks like a duck (To those who don't get it: Everyone seems to have an opinion on Nix, and everyone seems to write about it).

On Pyxis, yes. It's getting a rewrite. It's my second priority compared to Horologium at the moment, but when Horologium can meet my needs, I'll probably swap to Pyxis since I need a proper task manager for my daily life.

You may notice this piece is posted really close to the previous one, and you may think I'm a fast writer. I am *not* a fast writer, and the reason two articles can be posted at such a small interval is because the previous piece was originally drafted in August, and this one in September. "Why did you wait until November to post?" Well, procrastination obviously (no, actually, I was building the blog website).

That's it for this article. Next will either be the Horologium Caching post or the Nix post.
