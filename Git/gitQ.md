### Table of Contents - GIT

| No. | Questions |
| --- | --------- |
|   | **GIT** |
| 1 | [What is GIT??](#1)|
| 2 | [What is the difference between GIT and GitHub?](#2)|
| 3 | [What is a repository in GIT?](#3)|
| 4 | [What is the difference between GIT pull and GIT fetch?](#4)|
| 5 | [What is a GIT stash?](#5)|
| 6 | [What is a GIT merge?](#6)|
| 7 | [What is a GIT rebase?](#7)|
| 8 | [What is a GIT conflict?](#8)|
| 9 | [What is a GIT tag?](#9)|
| 10| [What is a GIT hook?](#10)|
| 11| [What is a GIT bisect?](#11)|
| 12| [What is a GIT blame?](#12)|
| 13| [What is a GIT revert?](#13)|
| 14| [What is a GIT cherry-pick?](#14)|
| 15| [What is a GIT reflog?](#15)|
| 16| [What is a GIT clean?](#16)|
| 17| [write commands step by step to create a new repository and push it to github](#17)|

# GIT Questions

## 1. What is GIT?<a id="1"></a>

Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.

## 2. What is the difference between GIT and GitHub?<a id="2"></a>

- <b>Git</b> is a version control system that lets you manage and keep track of your source code history.
- <b>Github</b> is a cloud-based hosting service that lets you manage Git repositories.

## 3. What is a repository in GIT?<a id="3"></a>

A repository contains a directory named .git, where git keeps all of its metadata for the repository. The content of the .git directory are private to git.

### 4. What is the difference between GIT pull and GIT fetch?<a id="4"></a>

- <b>git pull</b> is used to fetch and download content from a remote repository and immediately update the local repository to match that content.
- <b>git fetch</b> is used to fetch and download content from a remote repository but does not automatically update the local repository to match that content.

### 5. What is a GIT stash?<a id="5"></a>

Git stash takes the dirty state of your working directory — that is, your modified tracked files and staged changes — and saves it on a stack of unfinished changes that you can reapply at any time.

### 6. What is a GIT merge?<a id="6"></a>

The git merge command lets you take the independent lines of development created by git branch and integrate them into a single branch.

### 7. What is a GIT rebase?<a id="7"></a>

Git rebase is a command that allows developers to integrate changes from one branch to another. Rebase compresses all the changes into a single “patch.” Then it integrates the patch onto the target branch.

### 8. What is a GIT conflict?<a id="8"></a>

A conflict arises when two separate branches have made edits to the same line in a file, or when a file has been deleted in one branch but edited in the other.

### 9. What is a GIT tag?<a id="9"></a>

A tag is a pointer to a specific commit. It is like a branch that doesn’t change. Unlike branches, tags, after being created, have no further history of commits.

### 10. What is a GIT hook?<a id="10"></a>

Git hooks are scripts that Git executes before or after events such as: commit, push, and receive. Git hooks are a built-in feature - no need to download anything. Git hooks are run locally.

### 11. What is a GIT bisect?<a id="11"></a>

Git bisect is a command that helps to find which commit in your project’s history introduced a bug. It does this by using a binary search to find the commit that introduced the bug.

### 12. What is a GIT blame?<a id="12"></a>

Git blame is a command that shows you who has worked on what files and what lines in those files. It shows the revision history of a file.

### 13. What is a GIT revert?<a id="13"></a>

Git revert is a command that is used to undo a commit. It is a safer alternative to git reset, which rewrites the project history.

### 14. What is a GIT cherry-pick?<a id="14"></a>

Git cherry-pick is a command that takes changes from one branch and applies them onto another. It is useful when you need to apply a single commit from one branch to another.

### 15. What is a GIT reflog?<a id="15"></a>

Git reflog is a command that is used to manage the Git history. It is used to return information about operations performed on the repository.

### 16. What is a GIT clean?<a id="16"></a>

Git clean is a command that is used to delete untracked files from the local working tree. It is used to remove unwanted files from the working tree.


## write commands step by step to create a new repository and push it to github<a id="17"></a>

~~~bash

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin
git push -u origin main

~~~

# Most Commonly Used Commands

## 1. Git init

```bash
git init
```
- Initializes a new Git repository in the current directory.
- Creates a new subdirectory named .git that contains all of your necessary repository files.

## 2. Git clone

```bash
git clone <repository-url>
```
- Creates a copy of an existing Git repository.
- The repository can be on your local machine or on a remote server.

## 3. Git add

```bash
git add <file>
```
- Adds changes in the working directory to the staging area.
- You can add specific files or use `git add .` to add all changes in the current directory.
- You can also use `git add -A` to add all changes in the working directory, including deleted files.

## 4. Git commit

```bash
git commit -m "commit message"
```
- Records changes to the repository.
- The commit message should be a brief description of the changes made.

## 5. Git status

```bash
git status
```
- Displays the state of the working directory and the staging area.
- Shows which files are staged, unstaged, or untracked.
- Helps you see what changes have been made and what files are ready to be committed.

## 6. Git log

```bash
git log
```
- Displays the commit history for the current branch.
- Shows the commit hash, author, date, and commit message.
- You can use `git log --oneline` for a more concise view of the commit history.
- You can also use `git log --graph` to visualize the commit history as a graph.

## 7. Git branch

```bash
git branch
```
- Lists all branches in the repository.
- The current branch is highlighted with an asterisk (*).
- You can create a new branch with `git branch <branch-name>`.
- You can delete a branch with `git branch -d <branch-name>`.
- You can rename a branch with `git branch -m <old-branch-name> <new-branch-name>`.
- You can switch to a different branch with `git checkout <branch-name>`.

## 8. Git checkout

```bash
git checkout <branch-name>
```
- Switches to the specified branch.
- You can also use `git checkout <commit-hash>` to switch to a specific commit.
- You can use `git checkout -b <branch-name>` to create a new branch and switch to it in one command.

## 9. Git merge

```bash
git merge <branch-name>
```
- Merges the specified branch into the current branch.
- If there are conflicts, Git will prompt you to resolve them before completing the merge.
- You can use `git merge --abort` to cancel the merge and return to the previous state.
## 10. Git pull

```bash
git pull <remote> <branch>
```
- Fetches changes from the specified remote branch and merges them into the current branch.
- You can use `git pull origin main` to fetch and merge changes from the main branch of the origin remote.
- You can also use `git pull --rebase` to reapply your changes on top of the fetched changes.

## 11. Git push

```bash
git push <remote> <branch>
```
- Pushes changes from the local branch to the specified remote branch.
- You can use `git push origin main` to push changes from the local main branch to the main branch of the origin remote.
- You can use `git push -u origin <branch-name>` to set the upstream branch for the current branch.

## 12. Git remote

```bash
git remote
```
- Lists all remote repositories associated with the local repository.
- You can use `git remote add <name> <url>` to add a new remote repository.
- You can use `git remote remove <name>` to remove a remote repository.
- You can use `git remote -v` to view the URLs of the remote repositories.
## 13. Git fetch

```bash
git fetch <remote>
```
- Fetches changes from the specified remote repository without merging them into the current branch.
- You can use `git fetch origin` to fetch changes from the origin remote.
- You can use `git fetch --all` to fetch changes from all remote repositories.
## 14. Git reset

```bash
git reset <commit>
```
- Resets the current branch to the specified commit.
- You can use `git reset --hard <commit>` to discard all changes in the working directory and staging area.
- You can use `git reset --soft <commit>` to keep changes in the staging area.
- You can use `git reset --mixed <commit>` to keep changes in the working directory but discard changes in the staging area.
## 15. Git stash

```bash
git stash
```
- Stashes changes in the working directory and staging area.
- You can use `git stash list` to view the list of stashed changes.
- You can use `git stash apply` to apply the most recent stashed changes.
- You can use `git stash pop` to apply the most recent stashed changes and remove them from the stash.
- You can use `git stash drop` to remove a specific stash from the list.
- You can use `git stash clear` to remove all stashed changes.
## 16. Git diff

```bash
git diff
```
- Shows the differences between the working directory and the staging area.
- You can use `git diff <commit>` to show the differences between the working directory and a specific commit.
- You can use `git diff <commit1> <commit2>` to show the differences between two specific commits.
- You can use `git diff --cached` to show the differences between the staging area and the last commit.