[x] convert qa error, gradient to log scale

[x] make SvgWrapper take a fixed dimension rather than this observing nonsense

[x] actually make the grid

[x] separate and memoize the scaling, axis logic from the SvgWrapper and make it passed in

[x] axis and graph labels

[x] make x-axis changeable

[x] implement a table

[x] select active table, limited to corresponding filter

[x] implement table selection highlights

[x] Validate requested record ID against known set of records in useRoute.ts

[x] DRY out NC/NFP selection code in filter.ts

[x] DRY out the nc/nfp checkbox UI code

[x] Consider need for additional database indexing (I considered it, we don't need it right now)

[x] Check & prevent situation where active table refers to a graph that isn't visible

[x] Review and centralize styling in PlotScaling.tsx

[x] implement the 3d popups

    [x] Implement routing

    [x] Implement new-window click response action

    [x] Implement a summary screen for an individual record

    [x] Implement a Canvas / Three --> (use 63600 as an example record since it has surfaces and curves both)

    [x] Implement API to pull the model records

    [x] Implement magnetic field surface display

    [x] Fix color map for magnetic field surface display
    
    [x] Use dropdown for magnetic field surface color map styling

    [x] Implement checkbox to toggle magnetic field surface display layers

    [x] Look for way to smooth the triangulated surfaces for magnetic field display?

    [x] Implement drawing the 3d model on the Canvas

[x] Avoid relative imports

[x] Remove FilterEcho page

[x] Correct names of variables (e.g. iota is something other than shear; shear is w/r/t e.g. iota)

[x] Add all available variables as options for dependent and independent axes

[x] add horizontal lines for all plots regardless of dependent variable

[x] add "background field error" horizontal line for QA error plot (check received example code, s.b. 50e-6 or so)

[x] Review ranges in axes --> allow zooming in by the sliders

[x] restrict visible independent-axis to the range currently selected by the sliders? --> this is also a zoom thing, yes do this

[x] Round the aspect ratio to one decimal --> filtering superseded

[x] Fix display of slider for log scale

[x] color-code based on nc/hp values, not seed values

[x] UPDATED CONTROLS:

    [x] Dropdown for globalization method (both, 0, 1)

    [x] Dropdown for # fourier coils (both, 6, 16)

    [x] Add a "de/select all" checkbox to the default checkbox template
    
    [x] Turn mean iota into checkboxes

    [x] Checkboxes for n surfaces

    [x] Sliders for max kappa, max msc, min icd, qa error, aspect ratio, minor radius, volume, min c2sd

    [x] Unify sliders

[x] Get rid of the "filterNc, filterNfp" stuff

[x] Fix y-axis tickmarks and lines for log scale with smaller ranges

[x] "show entire stellarator" checkbox --> AG will give the operation

[x] (Performance is fine for full-circuit view)

[x] Add "open selected" button to the table

[x] add API endpoint for people to download the raw files

[x] Surface normalization: should normalize across entire device, not per-surface

[x] Provide static instructions for loading the VMEC files after download (two-liner python script a la the one in "received")

[x] REDO THE DATABASE EXPORT WITH QA ROOTED

[x] Add new keys: elongation, shear (slope of best least-squares linear approx of iota_profile); maybe surface_type and message.

[x] BETTER RANGES FOR ELONGATION!

[x] Give option to plot coil currents (found in the graphics/currents/ directory structure)
    
    [x] normalized per device, following sign convention --> good examples 034440, 034311, 167618

[x] Slider component

[x] Fix out-of-bounds display of marked lines

[x] Use consistent componenting for displayed-surfaces checkboxes as for elsewhere

[x] Prefer CSS classes over setting "style" on elements

[x] Add fetching & display of Poincare plots (PNGs)

[x] Another per-device plot: iota profile

[x] Rearrange layout of the model display page

[x] Bite the bullet and avoid needing the flask app
    [x] Precompute the changes for the graphics files

[x] Use database from permanent location of https://sdsc-users.flatironinstitute.org/~agiuliani/QUASR/
    --> NOTE: That isn't actually the permanent location

[x] DOWNLOAD COMPRESSED JSON!!
    [x] Bunch of second-order stuff related to downloading individual records, making sure we correctly handle when we don't have data for the model view
    [x] Talk w/ Dylan to test downloading from available pub-www directories

[x] Figure out how to ensure the Javascript app is delivered from the same origin as the web server

[x] An "about this" landing page

[x] don't hard-code width/height for canvas in Model.tsx --> worry about this later

[x] Figure out the weird notch in the coils of e.g. 206669 --> added "closed: true" to catmullrom3 geometry call

[x] Change default camera distance so that the whole figure is in the window (this should just be trig)

[x] Fix triangulation? Address repeats? etc. for 

[x] FIX PERMISSIONS

[x] Rewrite fetching to use TanStack Query/React Query for caching
    [x] Remove database as "context" element and replace with updating state in home component
    [x] NOTE: okay to use useQuery but see blog post for how to handle this along with react-router loaders

[x] surfaces to 60 x 60? (See test branch)

[ ] Big routing rewrite
    [-] static landing page -->
        [ ] NEW PLAN: This is going to be the same *page* but render one of two
            different child components based on whether we've completed the database
            load and clicked the Launch button.
    [x] download database async
        [x] --> DON'T download the database async if you're hitting a model/ page!
    [ ] "loading" screens for components that make fetch requests
    [x] inject *data* into plotting components, *NOT* fetch that data internally
        [ ] Okay this is half-done; we need to wrap up the fetch hooks into one hook

[-] Write up instructions for preprocessing data files, incl. in-memory database
    [ ] Latter should have the appropriate fields log-scaled, do JSONified output, and zip the result
    [ ] Rest of data: rsync it, delete the poincare directory, and run process_files.py
    [ ] For deployment, need to switch:
        - `base` variable in `vite.config.ts`
        - `basePath` in `useResourcePath.ts` (NO LONGER NEEDED)
        - `redirectHome` implementation in `useRoute.ts` (NO LONGER NEEDED)
        - `onClickDot` in `interactions.tsx` (NO LONGER NEEDED)
        - `useDatabase` hook in `database.ts` needs to expect UNCOMPRESSED file for local mode and COMPRESSED file (`true` parameter) for remote (NO LONGER NEEDED)
        - rename `public` directory to `publicX` to avoid packaging a bunch of files!
    [ ] Build this project (using appropriate basename in vite.config.ts). rsync dist/index.html and dist/assets/ to
        the server.
        - `yarn build`
        - `chmod 755 dist/*`
        - `rsync -vahP --delete dist/assets/ workstation:/mnt/home/jsoules/public_www/QUASR/assets/`
        - `rsync -vahP dist/index.html workstation:/mnt/home/jsoules/public_www/QUASR/`
        - one-liner FOR TEST DEV:
        - `yarn build && chmod 755 dist/* && rsync -vahP --delete dist/assets/ workstation:/mnt/home/jsoules/public_www/test/assets/ && rsync -vahP dist/index.html workstation:/mnt/home/jsoules/public_www/test/`

[ ] Filter dots by radius
    [ ] Probably happens *above* the plotting component level?
    [ ] (Since we've already got the scales and everything)
    [ ] ALTERNATIVELY --  figure out how to use Canvas instead of SVG to get around the size limits

[ ] Give user ability to choose criteria for plot-splitting

[ ] Expose ability for user to choose the field to base dot coloration on

[ ] AVOID REFILTERING for different plots/table selections
    [ ] Don't hard-code the variable listed in the individual plots
    [ ] Memoize the hierarchically divided groups at a higher level

[ ] Show/hide filters controls (i.e. tab in the control area)

[ ] Consider automatically updating selection state in NavigatorReducer.ts when the filters update, so that filtered-out records can't be selected

[ ] Try to fix the whole "open selected" button thing; or at least unify the interaction

[ ] Just implement drag-zoom already

[ ] Figure out a smarter way to right-size the table in the overview page

[ ] Note that horizontal line for non-QA error corresponds to Earth's background magnetic field

[ ] rewrite resource path finding to funnel everything consistently through getStringId and
    make sure calling components don't make assumptions (esp. Model and its subcomponents)


QUERY OR DISTANT:

[ ] MORE PROOFING of the surface symmetries, ESPECIALLY for higher-period-count.

[-] Reorg with index.js files to collect contents of small files

[?] Consider line-breaking of checkboxes for nc/nfp

[?] Confirm acceptable performance with the row selection features in the table

[?] implement dot mouseover highlights (??)

[-] secure domain name

[-] consider branding

[-] finalize deployment details with SCC

