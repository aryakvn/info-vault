# GitHub Actions Workflows

This directory contains GitHub Actions workflows for building and deploying the InfoVault application.

## Workflows

### 1. `deploy.yml` - GitHub Pages Deployment
This workflow uses GitHub's official Pages deployment system:
- **Trigger**: Push to main/master branch or pull requests
- **Action**: Builds the app and deploys to GitHub Pages
- **Result**: App available at `https://username.github.io/repository-name`

### 2. `pages-branch.yml` - Custom Pages Branch Deployment
This workflow creates and maintains a `pages` branch:
- **Trigger**: Push to main/master branch
- **Action**: Builds the app and deploys to a `pages` branch
- **Result**: App files available in the `pages` branch for custom hosting

## Setup Instructions

### Prerequisites
1. **Repository Settings**: Ensure your repository has GitHub Pages enabled
2. **Branch Protection**: Consider protecting the `pages` branch if using the custom deployment
3. **Permissions**: The workflows will request necessary permissions automatically

### GitHub Pages Configuration

#### Option 1: Use GitHub's Built-in Pages (Recommended)
1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. The `deploy.yml` workflow will handle deployment automatically

#### Option 2: Use Custom Pages Branch
1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select the `pages` branch
4. Set folder to `/ (root)`
5. The `pages-branch.yml` workflow will maintain this branch

### Workflow Triggers

Both workflows are triggered by:
- **Push to main/master**: Automatically deploys on every push
- **Manual trigger**: Use "workflow_dispatch" in GitHub Actions tab

## How It Works

### Build Process
1. **Checkout**: Clones your repository
2. **Node Setup**: Installs Node.js 18 with npm caching
3. **Dependencies**: Runs `npm ci` for clean install
4. **Build**: Executes `npm run build` to create production files

### Deployment Process

#### GitHub Pages (deploy.yml)
1. **Configure Pages**: Sets up GitHub Pages environment
2. **Upload Artifact**: Uploads built files to GitHub Pages
3. **Deploy**: Uses official GitHub Pages deployment action

#### Custom Branch (pages-branch.yml)
1. **Branch Management**: Creates or updates `pages` branch
2. **File Replacement**: Replaces all files with built version
3. **Git Operations**: Commits and pushes changes to `pages` branch

## File Structure After Deployment

The `pages` branch will contain only the built application files:
```
pages/
├── index.html
├── assets/
│   ├── main-[hash].js
│   ├── main-[hash].css
│   └── [other assets]
└── [other built files]
```

## Customization

### Environment Variables
You can add environment variables in your repository settings:
- `NODE_VERSION`: Override Node.js version (default: 18)
- `BUILD_COMMAND`: Override build command (default: `npm run build`)

### Build Output Directory
If your build outputs to a different directory than `dist`, update the workflow files:
```yaml
# In both workflows, change this line:
path: './dist'
# To your actual build output directory
```

### Branch Names
To use different branch names:
1. Update the workflow trigger branches
2. Update the deployment branch references
3. Update your GitHub Pages source settings

## Troubleshooting

### Common Issues

#### Build Failures
- Check that `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check Node.js version compatibility

#### Permission Errors
- Ensure workflows have `contents: write` permission
- Check repository settings for branch protection rules
- Verify GitHub Pages is enabled

#### Deployment Issues
- Check workflow logs in Actions tab
- Verify GitHub Pages source configuration
- Ensure `pages` branch exists (for custom deployment)

### Debugging
1. **Check Actions Tab**: View detailed logs for each step
2. **Local Testing**: Test build process locally first
3. **Branch Inspection**: Check the `pages` branch contents
4. **Settings Verification**: Confirm GitHub Pages configuration

## Security Considerations

- **Branch Protection**: Consider protecting the `pages` branch
- **Permissions**: Workflows request minimal necessary permissions
- **Secrets**: No sensitive data is exposed in the workflows
- **Artifacts**: Built files are cleaned up after deployment

## Performance

- **Caching**: npm dependencies are cached between runs
- **Concurrency**: Only one deployment runs at a time
- **Cleanup**: Old caches are automatically managed
- **Optimization**: Builds only when necessary

## Support

For issues with these workflows:
1. Check the GitHub Actions documentation
2. Review workflow logs for specific error messages
3. Verify your repository configuration
4. Test the build process locally first
