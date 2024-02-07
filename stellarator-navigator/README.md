# [Stellarator/QUASR] Navigator

This repository comprises a web application with in-memory database for filtering stellarator simulations from the QUASR collection,
along with rendering 3D visualizations of the resulting models. Much of the code--particularly in the structure of fetching data
files--makes strong assumptions about the data set being visualized, but I've tried to keep those fairly restricted and documented
by the type system, so that the codebase could potentially be applied to other data sets with manageable modifications to the
logic.

## Deployment

Deploying an updated version of this code (to accommodate new data sets or integrate updates to the application itself)
uses the following procedure.

### Modify Code to Account for New Data

- If there are substantial modifications to the underlying data model, account for them with code changes.
- Addition or reclassification of new fields within Stellarator Records can be accommodated by:
  - In `Types.ts`:
    - Adding new fields and descriptions to the `StellaratorRecord` type in `Types.ts`
    - Adding corresponding ranges to the `FilterSettings` type in `Types.ts`
  - In `DataDictionary.ts`:
    - Adding new fields to the `KnownFields` enum
    - Adding the new `KnownFields` entries to `DependentVariables`, `IndependentVariables` as appropriate
    (These determine which field options are allowed for the x- and y-axis value selection in browsing plots)
    - Adding the new `KnownFields` to `ToggleableVariables`, `RangeVariables`, `TripartiteVariables` as appropriate
    (These determine the type of controls that will be created for filtering: Toggleable are checkbox lists,
    Ranges are selected ranges, and Tripartite are categorical fields where we can display option 1, option 2, or both)
    - If there is a discrete set of valid values for the new data field, add a new entry along the lines of
    `meanIotaValidValues` or other examples
    - Add a full description of each new field in the `Fields` object
    - Add the new `KnownFields` entry to `CategoricalIndexedFields` if appropriate (these are used for creating
    indexes for the in-memory database)
- More complex changes (or applying this tool to a new data set) may require more extensive code updates and are
  beyond the scope of this readme.

### Re-Process the Source Data Files

- Run the `setup/process_db.py` script to generate a new version of the in-memory database.
  - If any fields have been added/changed, some modifications to this script may be needed.
  - Compress (gzip) the resulting JSON output for deployment.
- If there have been any changes or additions to the per-device data files (curves, currents, modB, surfaces, etc.)
then rerun the `setup/process_files.py` script to do needed file conversions and place the results in the proper
directory structure.
  - Note that this preprocessing code is tightly coupled with the path-construction logic in `util/makeResourcePath.ts`
- Ensure that all model data files (produced by `process_files.py`) have been copied to the web server in the
appropriate target directory, preserving the directory structure

### Build and Deploy the Project

- Confirm that `base` variable in `vite.config.ts` is set correctly (this should be undefined for deployment
to production at `https://quasr.flatironinstitute.org`)
- Review hard-coded paths in `util/makeResourcePath.ts` for accuracy (they should not need to be changed in
normal operation)
- Ensure that any potential `public` directory at the project base has been renamed to `publicX`: we do not want to
deploy any local copies of the data files
- Build and deploy the project:
  - Assuming the repository is checked out to SRC as `SRC/stellarator-navigator`, `cd` to
  `SRC/stellarator-navigator/stellarator-navigator` (`yarn` commands should be run from this directory, as should
  all `node` package installations)
  - Run any tests (TODO)
  - Run any linting via `yarn eslint .`
    - It may be desirable to repeat this with the `stylistic-type-checked` plugin uncommented in `.eslintrc.cjs`;
    that one's feedback is sometimes useful, but a bit too subjective/situational, so configuring it properly
    is not worth the effort
  - Ensure that the following are set up:
  - `yarn build`
  - `chmod 755 dist/*`
  - `rsync -vahPn --delete dist/assets/ $TARGET_DEPLOYMENT_DIRECTORY/assets/` (where `$TARGET_DEPLOYMENT_DIRECTORY` is
  set appropriately for your use case, i.e. the target for your web server)
    - **Note** the `n` flag for `rsync` which makes this a dry-run. If this test run reveals no issues, repeat
    without `n` to effectuate the deployment
  - `rsync -vahP dist/index.html $TARGET_DEPLOYMENT_DIRECTORY` to deploy `index.html` to the website root
  - Confirm that the following are set up within `$TARGET_DEPLOYMENT_DIRECTORY`:
    - an `overview` directory containing an `index.html` symlink to the `index.html` in `$TARGET_DEPLOYMENT_DIRECTORY`
    - `graphics`, `nml`, `records`, `simsopt_serials` directories (or symlinks to directories) holding the
    corresponding data files
- Visit the production deployment location and confirm that everything functions correctly

### Considerations for test and local deployment

At present, I maintain a test deployment site at `https://users.flatironinstitute.org/~jsoules/test/`.
Any potential deployment should be deployed there successfully and examined for correctness before being
deployed to production as described above.

To deploy to `test`, follow the same procedure as decribed above, EXCEPT:
- in `vite.config.js`, ensure `base` is set to `/~jsoules/test` (to match the base directory of the web
application from the server)
- Follow the same `build`, `rsync` etc. steps from above, replacing the target directory with wherever
the test files are stored on the web server (e.g. `workstation:/mnt/home/jsoules/public_www/test/`)

For local development:
- Ensure `vite.config.js` does not define `base`
- Ensure there is a `public/` directory at the root of this project (This directory will contain the
graphics and records files fetched for individual device display; if those aren't available, then the
app features won't work)
  - Ensure that the `database.json.gz` file is present in this directory (it will be automatically
  unzipped in local mode, but the code is aware of that) for loading the in-memory database
  - Ensure that the `graphics/` and `records/` directories are copied into `public/`
  - **NOTE** that the `public/` directory **must not be present for deployment**--you don't want
  to push gigabytes of data to your deployment location needlessly!
  - Both `public/` and `publicX/` are present in the `.gitignore` for the project, so they should
  not be picked up for version control.
