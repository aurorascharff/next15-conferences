# DEMO STEPS

## Introduction

- Fullscreen view
- Aurora, web dev, norway, consultant at Crayon Consulting in oslo
- Excited to speak here today, because i'll be teaching about modern react patterns: concurrent rendering, actions, and whats next.
- Handling async operations in UI components can be tricky, we might encounter flickering pending states, inefficient state updates, unstable UX, and excess complexity.
- React 18 already gave us concurrent rendering, which allowed us to improve the UX and responsiveness of our apps. Now, in 19, we have even more tools at our disposal, and new ways to combine them.
- These are the concurrent features we are going to explore today. useTransition, useOptimistic, and useDeferredValue. They are going to become increasingly more important with View Transitions coming to React, which we will also check out at the end!
- Who here has ever used useTransition?
- Who here has ever used useOptimistic?
- Who here has ever used useDeferredValue?
- Who has tried the canary release of View Transitions in React?
- Perfect! Let's begin, and dive deeper into these hooks. Click button.

## Setup

- I have some selects here for years, tags, speakers, and conferences.
- They're actually created with Ariakit using custom styling, where Ariakit handles the accessibility and interactions, like keyboard nav, click outside, focus, and viewport aware placement.
- Try selects. Selects feel stuck, i suppose async. We're having some weird loading states that flicker and are not in sync on multiple selection, losing the last update. We have some UX problems here. Let's get to the code.

## Introduce starting point AsyncSelect

- The selects are created by this this AsyncSelect component.
- If we look at the code, we can see the selects implemented in the most common way people write React code today. There's a select, which has an onSelect event. In that event, we execute some async work, and then set the selected state. Finally, while the async work is in progress, we set a loading state to true. And we have a toast side effect on error.
- Looking at this code, we're able to see the cause of UX problems, the stuck select and loading flicker. The state is set after the async function, causing the delayed update. Then, when we click an item, the code does sets loading to true. But when we click another, because we have a shared loading state, whichever async call finishes first overwrites the next state, leading to this premature loading state. The select value is overwritten by the last call.
- (We might need request tracking and cancellation, or disable the interaction entirely while its pending to fix this!)
- The fundamental issue here is that the browser does not natively support async events, and coordinating async work across events. What we need is a way to coordinate the state as multiple things are clicked, and at the end complete everything at once.

## AsyncSelect with useTransition

- Fortunately, React has a API for this: transitions. Transitions allow react to coordinate async requests in events and render. Let's see how we can use transitions here to create a better experience, with no flickering, and less code.
- Let's replace the manual loading state with a transition here to simplify this pattern. IsPending and startTransition. startTransition creates lower priority, deferred state update.
- We can use useTransition and wrap the state update and the async call. React 19 allowed transitions to be async.
- Wrap it also around the setSelected to coordinate the whole update. This additional startTransition will not necessary in the future.
- Creating an Action. An action is a function called in a transition, meaning we have a specific term for this type of lower priority behavior, that executes all events in a batch once they're all done.
- Showcase.
- At this point, the flickering UI problems are fixed. All the updates execute once all transitions are done, keeping them in sync.

## AsyncSelect with useOptimistic

- How do we make this better? I still have the UX problem of the select values not updating until the async operation is done. The select is not reflecting the user action immediately, it feels "stuck", (and it only select one value. We could use the updater function.)
- We could add a naive optimistic update, where we set the state immediately, and then revert it if the async operation fails. But let's try useOptimistic instead, which is designed for this exact use case.
- UseOptimistic let's us manage optimistic updates more easily, and works along side Actions. It takes in state to show when no action is pending, and update function, and the optimistic state and trigger.
- Within a transition, we can create a temporary optimistic update. This state shows for as long as the transitions run, and when its done, settles to the passed value. Seamlessly merge with the new value.
- Showcase.
- (React will use the optimistic value until all of the transitions are complete. Which means if you click multiple times, we will use all of their optimistic values until all of the transitions complete in one batch).
- It becomes clearer with a rejecting promise. Comment out toast, showcase.
- Comment back toast.
- Notice how our interaction is completely smooth, we have a robust optimistic update that works with the transition, and less code, and no UX problems.

## Review app

- So what is this app anyway? Open sidebar.
- This is actually a Next.js App Router app, using Prisma ORM and an Prisma Postgres DB, Tailwind CSS.
- Go to page. We were just using the filters, let's actually add inn all the functionality here.
- I'm using server components to fetch data. Page.tsx gets the active filters from the searchparams, and the filter options are created from all data in the database. We're getting the talks based on these filters directly in the server comp, and passing it down to a as a promise.
- (We're using async await here because we're in a server component, but if this was a client app, we could use use() instead, so these patterns are useful in either RSC or CSR.)
- Demo app: See talks, click talks, search.

## RouterSelect expose action

- Let's hook our async select up to filter! We want to be able to select a filter, and have the talks list update. Instead of using this dummy async function, let's actually update the URL and have the server fetch the new data.
- Add search params. Add a param string with createParam. - Remove internal state, get it from the passed params
- The way the nextjs router works, is the params don't update until the new page is ready. Now, we are tracking our transition state to the new page with the new params.
- The filters are already working, giving us this optimistic and smooth flicker-free ui.
- Let's rename this to RouterSelect since we want to reuse this functionality for a specific component. Typical reusable use case we encounter in nextjs app router.
- So in our select we are updating the router, but what happens if we want to add a toast or do more things in the action? And we don't want to be part of the reusable component.
- We want to create a way to execute a synced outdate from the outside. What can expose an action prop, a function called within the transition.
- We should await this so the parent can pass either sync or async here for max flexibility.
- Notice the naming. We need to mark our deferred behavior so the parent knows this is happening in a transition. This is a convention with actions, to use the action suffix.
- Think about the new react 19 form. We have either onSubmit or action, depending on our needs. And now we are doing it with our own components!
- We could even extract the whole routing logic out to make this a reusable async select design component, which is a pattern that the React team is working on getting implemented by design systems. That means we don't have to code this ourselves. But for this demo, lets keep it here. Regardless, we need to know what it means to have an action prop.

## Filters use the action prop

- Let's start adding some custom behavior. I just have a bunch of random side effects so that we can understand the possibilities.
- Add selectAction year.
- Since react is coordinating the action for us, we can add anything to this action callback an it will be included in the transition automatically.
- The naming will tell us what to expect. We know this is using a transition because of the action suffix.
- Year: Customize loading bar: Set progress 100 state, hide spinner, synced to the transition.  Want also a ui update instantly. Optimistic reducer function, to coordinate any transition to this optimistic update. We can call it without another transition here bc of the naming, just like a form action. Add optimistic state and replace. We know that the optimistic is triggered right away and, and the regular state is synced to the action, and the optimistic update settles.
- Tag: Add simple toast like we used to have to with SelectAction. Update theme variable with this doc ref, this is a ref and imperative so its not coordinated with the transition.
- Speaker: Add optimistic exploding, handles its own reset state after transition completes. No revert state or timeouts. Optimistic update synced to the transition! Again, no additional transition needed.
- Conference: We can also call async functions in the action, executed at the end, like a logger of what confs are selected. And a random server function. Maybe we can trigger this at some point.
- Let's move on for now, and start adding some view transitions!

## View Transitions

- DOCS: View transitions are coming to react a a component! Currently installable in canary channel, and available in nextjs. And the reason it fits so well into this talk is because we need to know all these concurrent features to make the most out of view transitions.
- Because view transitions are triggered when elements update a transition, a suspense, or a deferred update.
- For example, when a transition finishes, react will automatically animate the result of the transition to the new UI.

## Add View Transitions

- Layout.tsx. Let's start simple and wrap the app with a app viewtrans component to enable the default crossfade. Suspense is already animating. Also the filters! NextJS is following the suspense-enabled router pattern from the React team, so every route navigation is wrapped in a transition. So ViewTransitions works out of the box with our filters, it adds this cross fade.
- But for many of these interactions we don't want that. So let's remove it from the whole page, and add it for specific parts we want to animate lower in the tree.
- Let's see the TalksExplorer. The Talks client component has a search, is receiving the talks promise. Suspending with a fallback.

### Talks grid

- As the talks grid streams in, we want to animate the suspense fallback to the content. Suspense triggers ViewTransitions, so we can wrap the Suspense fallback in a ViewTransition.
- View trans have 4 activators based on how the view trans component behaves: enter: VT is added to DOM, exit: VT removed DOM, update: updates occur inside it, name: it's a shared element transition between two VTs removed and added in the same transition. We can add custom animations for each activator.
- Customize exit activator on suspense with "slide-down"! Removed from the DOM. This is custom animations that I've added to my css file like this.
- Wrap grid in ViewTransition. Customize enter and exit on grid. Move key to trigger this exit/enter animation on the grid when the talks change. Animates down and the list goes up.
- But if you do this, it's going to opt-in the whole subtree to unintended animations, so what you typically do add a default of none, so it doesnt crossfade everything else.
- (Note the exit, enter, and default props. This means when the fallback exits, and the content enters, it will animate. But since the default is "none" it wont crossfade any other update in the tree below, causing unexpected animations.)

### Talk details

- How about this item detail.
- Go to Grid, let's add a view trans to the talk details, enter slide-in.
- If we want animation, we need to wrap the state update in a transition.
- Our TalkCard has an action prop as well, let's switch to an action so we know it's in a transition already. Let's use the closeAction to animate close as well.
- When this transition finishes, react will automatically animate the result of the transition to the new UI.
- However, i see that two different related components are in the view at separate times. To animate between them, we can use a shared element transition.
- Wrap TalkCard in ViewTransition. We can add a name to these. The names need to be unique and the same. See animation.
- (For shared element transitions, if the thing you're sharing is not visible in the before/after, react will fall back to a cross fade instead of things flying off screen. So when I scroll down to the bottom, click the last item - it will expand into it. But when I close it and go back to the list (which is at the top) that item is no longer visible on the screen so it just cross fades close. React automatically figures out what the right thing to do is!)

### Search interaction

- Finally, how about the search interaction. I already a ViewTransition on the cards, but theyre not animating. Thats' because there is no transition or deferred update on this search. Let's solve it with useDeferredValue.
- Now, you may know, from react 18, you could use it to avoid blocking input responsiveness by deferring the value until react is able to render it, like in our search. It can also be used with async data fetching to avoid jarring UI updates in something like a combobox.
- Let's use useDeferredValue here to trigger a viewtransition! DeferredValue will lag begind. Add isStale indicator for the spinner!
- React can automatically animate the result of the deferred update to the new UI.
- (Use chrome devtools to slow down the animations! Animation drawer. Showcase.)
- React has let me declaratively define my view trans, while doing all the work and handling all the possible edge cases. I'm really bad at animations but I was still able to add all this!

## Final demo

- Fullscreen view
- Let's see all of this in action! Full screen.
- Initial load suspense animation out and list in.
- We can click the items and have this named view transition connecting the two items. I also have clickable badges by the way, they also animate now on router push!
- And we can clear the filters with a smooth transition in and out, the slide-down on the list, and the cards moving.
- We have the filterable list with the filtering animation here, triggered by useDeferredValue. Unfilter.
- We can execute the custom select components with a various set of side effects based on the transition behavior. Year. Animates as well because its a router push. Notice the smooth UX on the select and the loading bar.
- Tag: angular, solid, react, vue. Clear.
- Speaker, Clear.
- Conference: Let's try to trigger that random server function somehow. It's react universe 2025 right?

## Conclusion

That's it for this talk, the code is pinned on my GitHub and accessible through the QR code here, and follow me on my socials or reach out to me in the future! Thanks for having, see you again!