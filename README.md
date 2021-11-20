[![CI](https://github.com/pikesley/jlock/actions/workflows/main.yml/badge.svg)](https://github.com/pikesley/jlock/actions/workflows/main.yml)

# Jlock

https://user-images.githubusercontent.com/885973/142743936-73d308e9-493a-4966-bf62-39bcb9ade81b.mp4

## Make your own text clock

Things you will need:

### A Raspberry Pi

_At least_ a Pi 3 A+. A tried it with a Zero, but it doesn't have enough grunt to handle the CSS animations. Anything beefier than a Model 3A+ would obviously work too, but the 3A+ is at the sweet spot for power-consumption versus performance (and price).

### A 4x3 monitor

Ideally you'd want a fully-square one, but these seem to be few and far between - a [search on eBay for "square monitor" yields a whole load of 4x3s](https://www.ebay.co.uk/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw=square+monitor&_sacat=0) claiming to be square, but 4x3 is close enough.

### A cable

HDMI to whatever's on the monitor. The Model A has a full-size HDMI port, the Pi 4 has micro-HDMI, and the Zero has mini-HDMI. The monitor I got has a DVI port, and such cables are [easy to come by](https://www.ebay.co.uk/sch/i.html?_from=R40&_trksid=p2380057.m570.l1311&_nkw=hdmi+dvi+cable&_sacat=0).

## Install it

This was all done on a pristine install of Raspberry Pi OS Lite (i.e. no desktop) via the [Raspberry Pi Imager](https://www.raspberrypi.com/news/raspberry-pi-imager-imaging-utility/). Presuming you can SSH into the Pi,

(optionally) change the hostname:

```bash
sudo raspi-config nonint do_hostname jlock
sudo reboot
```

Once you've done this you should be able to get to the Pi with

```bash
ssh pi@jlock.local
```

### Install the screen drivers

If you're using a [HyperPixel](https://shop.pimoroni.com/products/hyperpixel-4-square?variant=30138251444307) screen, then you need to install the drivers. Per [this](https://github.com/pimoroni/hyperpixel4):

```bash
curl https://get.pimoroni.com/hyperpixel4 | bash
```

Select the correct screen and Pi combination (in my case it's `3 : Weirdly Square - Pi 3B+ or older` and `1: 2020 or earlier`) and let it do its thing. When it's done it will reboot, and the screen should work. Then:

### Install Git

Git isn't installed out-of-the-box (although it is a dependency of the screen-drivers above), so:

```bash
sudo apt -y update && sudo apt install -y git
```

### Clone this repo

```
git clone https://github.com/pikesley/jlock
cd jlock
```

### And configure everything

```bash
./configure
make
```

This will install everything, and then reboot into a running clock.

![running jlock](assets/images/jlock.png)

There should be a control interface available at [http://jlock.local/controller/](http://jlock.local/controller/) from which you can cycle through the available clock designs.

## Development

This was all developed on a Docker container. To run it:

```
git clone https://github.com/pikesley/jlock
cd jlock
./configure
make build
make run
```

The container starts `redis` and `nginx` when you connect to it, so it should be running at [http://localhost:8080/](http://localhost:8080/). If you start the `controller`

```bash
python controller.py
```

then there should be a control interface at [http://localhost:8000/controller/](http://localhost:8000/controller/). Note that this interface is designed to run on a phone and the layout is not responsive, so you might want to open the inspector and set it to emulate a phone.

### Tests

Install the node dependencies (these are not needed to run tha actual clock)

```bash
npm install
```

and then run the [tests](tests/) (and the linters):

```bash
make
```

### Designs

I wrote about my massively over-engineered design system [here](sass/clocks/README.md). To actually get the designs building, you'll need to get another connection to the container:

```
make exec
```

then start Sass:

```
make sass
```

### Push changes to the Pi

As long as `PIHOST` at the top of the [Makefile](Makefile) resolves to the address of your Pi, you should ba able to push new code to it with:

```bash
make push-code
```

On the Pi, you can force the browser to reload with

```bash
DISPLAY=:0 xdotool key F5
```

(this is all the `controller` webserver is doing tbh)

## Notes

- This was developed _specifically on and for Chrome/Chromium_. It works OK on Firefox and Safari, and it makes no sense at all on a portrait-orientated phone or tablet, but it was built to work as a kiosk app running on a Pi, which it does very well.
- For more about running a Pi in Kiosk Mode, see the `configure-shell` target [in this Makefile](make/Makefile.pi).
- There are some incredible people doing some [amazing CSS text trickery](https://freefrontend.com/css-text-effects/).
- This owes a great debt to [Carson Farmer's text-based clock](http://bl.ocks.org/carsonfarmer/a60c1ffa72bf58934bbd), written in [d3.js](https://d3js.org/).
- Any similarity to a clock you can actually buy for thousands of pounds is entirely coincidental.
