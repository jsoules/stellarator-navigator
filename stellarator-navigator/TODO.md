[x] convert qa error, gradient to log scale

[x] make SvgWrapper take a fixed dimension rather than this observing nonsense

[x] actually make the grid

[x] separate and memoize the scaling, axis logic from the SvgWrapper and make it passed in

[x] axis and graph labels

[x] make x-axis changeable

[x] implement a table

[x] select active table, limited to corresponding filter

[x] implement table selection highlights

[?] implement dot mouseover highlights (??)

[x] Validate requested record ID against known set of records in useRoute.ts

[x] DRY out NC/NFP selection code in filter.ts

[x] DRY out the nc/nfp checkbox UI code

[x] Consider need for additional database indexing (I considered it, we don't need it right now)

[x] Check & prevent situation where active table refers to a graph that isn't visible

[x] Review and centralize styling in PlotScaling.tsx

[ ] implement the 3d popups

    [x] Implement routing

    [x] Implement new-window click response action

    [x] Implement a summary screen for an individual record

    [x] Implement a Canvas / Three --> (use 63600 as an example record since it has surfaces and curves both)

    [x] Implement API to pull the model records

    [x] Implement magnetic field surface display

    [x] Fix color map for magnetic field surface display
    
    [ ] Use dropdown for magnetic field surface color map styling

    [ ] Implement checkbox to toggle magnetic field surface display layers

    [ ] Look for way to smooth the triangulated surfaces for magnetic field display?

    [x] Implement drawing the 3d model on the Canvas

[ ] Ensure good package structure for javascript files

[ ] Consider removing route to FilterEcho page in useRoute.ts for production

[ ] Consider automatically updating selection state in NavigatorReducer.ts when the filters update, so that filtered-out records can't be selected

[?] Consider line-breaking of checkboxes for nc/nfp

[ ] Correct names of variables (e.g. iota is something other than shear; shear is w/r/t e.g. iota)

[ ] Add all available variables as options for dependent and independent axes

[ ] Review ranges in axes --> allow zooming in by the sliders

[?] make static axis settings for the different dependent variables, rather than recomputing in one component

[ ] add horizontal lines for all plots regardless of dependent variable

[ ] add "background field error" horizontal line for QA error plot (check received example code, s.b. 50e-6 or so)

[ ] restrict visible independent-axis to the range currently selected by the sliders? --> this is also a zoom thing, yes do this

[ ] Round the aspect ratio to one decimal; group by it and allow it to be selected (dropdown or checkbox, AG to send values)

[?] don't hard-code width/height for canvas in Model.tsx --> worry about this later

[?] Confirm acceptable performance with the row selection features in the table

[-] secure domain name

[-] consider branding

[-] finalize deployment details with SCC

[ ] "show entire stellarator" checkbox --> AG will give the operation

[ ] Revisit normalization for fields: should normalize across entire device, no?

