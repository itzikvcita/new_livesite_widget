# Create GitHub repository for new_livesite_widget

## Step 1: Create the repo on GitHub

1. Open **https://github.com/new**
2. Set **Repository name** to: `new_livesite_widget`
3. Choose **Public** or **Private**
4. **Do not** check "Add a README" (you already have local files)
5. Click **Create repository**

## Step 2: Connect your local repo and push

After the repo is created, GitHub will show you commands. Or run these (replace `YOUR_USERNAME` with your GitHub username):

```powershell
cd C:\Programming\new_livesite_widget
git remote add origin https://github.com/YOUR_USERNAME/new_livesite_widget.git
git branch -M main
git push -u origin main
```

If your default branch is already `main`, the second line is optional.

---

**Using SSH instead of HTTPS?**

```powershell
git remote add origin git@github.com:YOUR_USERNAME/new_livesite_widget.git
```
