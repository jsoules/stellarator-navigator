# Stellarator Navigator / QUASR

This is a web interface for the QUASR database, published by Andrew Giuliani in 2024 (and ongoing). It allows users
to explore the (several hundred thousand) fusion reactor models contained in that work, identifying interesting
devices by filtering from physics quantities; and to click through to 3D models and full data of any identified
devices of interest.

Currently it loads the complete QUASR database in-memory at first page visit, and serves the data files for
individual models asynchronously upon request. There is no actual backing database to respond to filtering:
this is all done in-memory, making it quite responsive and reducing infrastructure requirements, at the
expense of somewhat protracted load times. (This decision may be revisited in the future.)

The user interface is built entirely in React. Plots are built with WebGL, while the 3D models are
displayed using three.js. The repository also contains some Python code which handles preprocessing.

To see it live, visit [the production site](https://quasr.flatironinstitute.org).
