---
type: astrolabe
title: "Horologium: Overthinking my data model for a time tracker"
description: Accidentally overthinking what an "Interval" actually means in time tracking, realizing that there's a different way to store what happened when.
publish: 2026-11-07
slug: horologium-overthinking-my-data-model-for-a-time-tracker
topics:
  - Horologium
  - Systems Design
  - Local-first
tags:
draft: false
---
## What is time-tracking?
Most people probably know what time tracking is. However, I thought I'd explain why specifically my requirements may differ from others. Time tracking is often the practice of recording time spent on tasks or projects. This is often used to track employee time or oftentimes freelancing and the fees associated.

Where my needs differ is that I don't do it just for tasks and projects. When I track my time, I also often track how long I spent resting, idle, socializing, or even sleep[^1]. So this means that, for me, I'm always tracking what I'm doing in a given day.
## Why I couldn't just use existing tools
While many tools exist to track time, I often don't find them satisfactory because of the previously mentioned slightly odd use case. I'm not really just tracking my work time, so my use case isn't just on my computer. I'd often start entries from my phone, laptop, tablet, or whatever. This means the usual "Stop-then-start" loop is a bit annoying. Finally, a minor complaint, but the fact that I lose a few seconds each time I start a new action somewhat annoys me.

Additionally, I often find that sometimes these tools don't work offline- they connect to a server and require a stable connection to be able to track my time. That's slightly not ideal for someone who wants to be able to say, track how long I'm in transit, just as the underground train starts moving and I lose my internet connection.

Other than those, it's always a nice little learning opportunity when you notice that software you've been using isn't really satisfactory, so that's really where this all started.
## My design constraints
Based on my needs, I devised a few design constraints (or requirements, depending on your taste) that I wanted to be able to fulfill. Namely,
- **Local-first**  
	As mentioned, spotty internet issues are unacceptable to me, and I want to be able to record my time without connection to the internet at all.
- **Standalone**  
	Because I'm a student without the resources to blow on a vps, each instance of the application should be standalone, not requiring a server or another instance to function.
- **Human-readable Data**  
	I'm sure this one seems to come out of nowhere, but the above two constraints allow me to add this in with the express goal of easier debugging and also being able to check the data even if my application breaks.
- **Fast Common Loop**  
	Since I want to record things on the go, ideally I thought that the action of recording should be as fast as possible, with as few actions needed by me as possible.
These constraints were what I defined at the start of the project, albeit with the expectation that I would have to be open to compromising on one or two of these.
## The problem
Generally, I ran into one problem in the development of the data model for this application. Namely, "How do you write events while being offline".

In general, the process of recording a new event has always gone as follows for me, on nearly every tool that I have tried.
1. Stop the previous event
2. Start the next event
3. Enter details for your current event
Some systems do simplify this process one way or another, but generally that's the loop I run into. As you can see, steps 2 and 3 are pretty much fine. The next event and the data for the current event can be written on-device and synced later just fine. The issue would be that the previous event cannot be stopped if we don't know which event is the previous event.

Generally, this means that events, stored as intervals (with a clear start and stop), are history-dependent units. They need to be written to twice- once to start them, and once to stop them. They are history-dependent in the way that to stop them, you need information from what started them.

So, I found the general question I had to solve was "How do I make units of events not history-dependent?".
## overthinking a data model.
The key insight for me is realizing my constraints are different from those that govern the industry standards. While they are building things that are general, where events have to- for example, be able to run in parallel- I'm building something that's personal. And going back to that example, my events don't ever run in parallel[^2].

This means, rather than storing data like a 2-dimensional grid: where time is on one axis, and the possible parallel events (e.g. what you did) are on the other axis. I'm doing this in a one dimensional line, where the line is time itself, and what you did is just the content at each part of the line. This means the problem is far more bounded. Rather than asking "at what time did this event happen", we can ask "at time x, what event happened?"

At that point, I arrived at the following line of thought to build my current data model
1. Since there can only be one event at any time x, we can establish that when an event starts, the previous event *must* end.
2. The "end" of an event is always implied by the next event "starting", given two adjacent events.
3. We can treat "stop tracking" as a distinct event, rather than just treating it as way to close the previous event.[^3]
4. There are 2 states of a time-tracker. "tracking" and "not tracking".
5. Due to points 3 and 4, we can cover both the "tracking" and "not tracking" states of a time tracker using only adjacent events.
6. Since all states can be represented as adjacent events, we can always find the "end" of an event given the "start" of the next one.
And such, since the "end" is implied, we never actually have to "stop" the previous event when we start the next event. And as such, by simply deriving the "end" of events from the start times of the previously adjacent event, we've decoupled the events from history, turning them not history-dependent.
## Tradeoffs, and what this actually is useful for
So my approach to this does have a few tradeoffs. These are things that I personally deem acceptable but make this approach less than ideal for most cases. Namely,
- **No Parallel Events**  
	This one is key to the insight, but you can't track multiple events at once. This approach assumes that you're only doing one thing at a time.
- **More Computationally Expensive**  
	Since the truth needs to be derived and transformed, more computation cost is required to get this all working. Though this will be something I explore in later blog entries through my decisions in cache design.
- **Development Difficulty**  
	Due to the nature of just how the application is structured, the development is a bit harder compared to your traditional application since you don't have a central database to use as the source of truth, so a lot of attention needs to be placed in how you package each event to ensure they don't conflict when merged. Stay tuned, and this post will be updated when the time comes for me to discuss caching.
- **Still Technically Not Entirely Conflict-proof**  
	Although this approach solves the idea of conflicts in the common case of "adding a new event", this doesn't actually solve the case of editing events, settings, or even additional fluff like tags or project definitions. In these cases, conflicts can still happen, and mitigation requires more exploration
So this approach really is only useful for my own specific use case- something that's single-tracking and I can afford the computational cost, and the difficulty in development just means I need to learn more. But I think in a way that's a part of what I find interesting about working on projects like these- it's that you get to converge on a solution that's somewhat overkill to a problem that you have, and you get to learn from it.

## Future work
I still have some stuff to talk about that isn't fully fleshed out like cache design, the optimization of the cache, and even the underlying human-readable file format that I decided to make purely for fun and to learn as well. For now, I'm working with my current data model to build up Horologium, and there's still a lot to work forwards on, including handling the previously mentioned tradeoffs of this exact approach.

## Author's Notes
This is my first piece of writing! I really hope it was at least somewhat okay. I don't really write much. There was supposed to be a section here explaining who I am, but now that I have a portfolio website you can just go to [Astrolabe](https://astrolabe.starrytea.cc) instead.

On Horologium, it's a work in progress. You can check out the Rust CLI version in [Horologium (Forgejo)](https://git.starrytea.cc/Constellation-Project/Horologium) or [Horologium (GitHub Mirror)](https://github.com/Stelare-Rose/Horologium) and then probably I'll port to mobile before building a desktop version on Tauri. Though none of that is final, I'm just working with the tech that I know and am familiar with.

That's probably it from me. Thanks for reading! Hope you enjoyed it.

[^1]: Though I say sleep here, I do mean the "intent" to sleep, as most time trackers don't truly allow me to say "Hey, start this when I fall asleep".

[^2]: I only ever track one thing at a time. Even when I'm doing two things at a time, I consider the one I'm "focused" on as the one I'm tracking. I'm well aware this is a flimsy and not at all "coherent" system, but so often our human systems don't match up with our technical desires, so that's what I'm designing around.

[^3]: Since events are implied to be stopped by the next event starting, that only leaves the case of "stop tracking anything" to be handled. Therefore, we still need a distinct event to say "stop tracking anything".
