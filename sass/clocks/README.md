# Using this Sass

Sass's (very powerful) `module` system requires that our `@use` lines come before anything else. So what do we have:

## modules

### `layout`

Your design _must_ have

```scss
@use "../base/layout";
```

because that's where all the `grid` stuff comes from, along with some other default things.

### `font`

You probably want something like

```scss
$font: "Some font";
@use "../base/font" with (
  $font: $font
);
```

where `Some font` is a [Google webfont](https://fonts.google.com/).

This is not mandatory, if you want to bring your own font or whatever you can do something like

```scss
@font-face {
  font-family: "Foo";
  src: url("../../fonts/foo.ttf") format("truetype");
}

body {
  font-family: "Foo";
}
```

further down your Sass file.

### `animator`

You're going to want to include an [`animator`](https://github.com/pikesley/jlock/blob/main/sass/base/animators/README.md). The simplest animator is the `fader`:

```scss
@use "../base/animators/fader" as animator;
```

### `vars`

```scss
@use "../base/vars";
```

This contains a few handy default things, particularly `$background-root`:

```scss
background: url(vars.$background-root + "foo.png");
```

### `strokes`

```scss
@use "../base/strokes";
```

Contains a couple of handy `stroke`-related `@mixins`:

```scss
@include strokes.width(1px);
@include strokes.colour(teal);
```

## Defining your styles

Once you've included all the modules you want, you're going want to define your `body` styles:

```scss
$grey: rgba(4, 4, 4, 0.445);
$background-colour: white;
$active-colour: $grey;

$stroke-width: 1px;

body {
  background: url(vars.$background-root + "wall.png"), $background-colour;
  font-size: 6vh;
  @include strokes.width($stroke-width);
  @include strokes.colour($active-colour);
  color: transparent;
}
```

and possibly tweak some other things:

```scss
span {
  margin: -1vh;
}
```

and then set up your animator. An animator exposes an API which allows you to set `$activated-styles` and `$deactivated-styles`:

```scss
animator.$activated-styles: (color: red);
animator.$deactivated-styles: (color: blue); // this one is actually optional
```

and then call a special `@mixin`:

```scss
@include animator.setup(2s); // `2s` is the animation duration
```

to populate your CSS with everything you need for your animation.

### Passing those styles

Note that you need to pass _Sass `maps`_ to the animator, not regular CSS declarations. Maps are comma-separated, which means if you need to pass styles that contain commas (for fancy shadows, for example), you need to wrap the values in brackets:

```scss
animator.$activated-styles: (
  color: $blue,
  text-shadow: (
    $colour-0 0 0 0.1vh,
    $colour-1 0 -0.1vh 0.2vh,
    $colour-2 0 -0.3vh 0.2vh,
  )
);
```

> It took me far too long to work out that this is the way to pass styles into modules, and it was only once I understood this that I realised that Sass modules are in fact amazing and not irretrievably cursed
