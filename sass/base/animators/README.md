# Animators

To use one of these from a client, do something like:

```sass
@use "../base/animators/rotator" as animator;

animator.$activated-styles: (color: red);
animator.$deactivated-styles: (color: blue);
animator.setup
```

## API

An `animator` should expose the following two variables:

```scss
$activated-styles: none;
$deactivated-styles: none;
```

which a client expects to populate with Sass `maps` , _not_ CSS declarations:

```scss
animator.$activated-styles: (color: red);
```

and then a `@mixin` called `setup`:

```scss
@mixin setup($duration: 2s) {
  @include utils.active-inactive($name, $duration);
  @include make-frames;
}
```

The `utils.active-inactive` mixin sets the appropriate animations on the `.active` and `.inactive` classes (which are assigned by the clock when it updates itself), and `make-frames` creates whatever `@keyframes` are need to support those.
