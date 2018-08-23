---
title: "Splitting SSH and git configs"
date: 2018-07-24T18:28:07+01:00
tags: ["code"]
---


To separate work and personal projects, I run different SSH keys and git configs. For example specifying a different SSH key and git email for personal and work projects.

This allows me to clone any project, work or personal and get started straight away. 

<br>

# SSH config

#### Step 1: Create SSH key

```bash
ssh-keygen -t rsa -C "j.fry@work.com"
```

When asked for the name give a new file name: `id_rsa_work`

#### Step 2: Create SSH config

Create an empty file called `config` in `~/.ssh`

Add a host entry pointing to your newly made SSH-key by specifying an **IdentityFile**.
In this example I am pointing all bitbucket requests to my `id_rsa_work` SSH key.

```
Host bitbucket.org
HostName bitbucket.org
User git
IdentityFile ~/.ssh/id_rsa_work
```

#### Step 3: Register SSH keys

You need to register your new SSH keys

```bash
ssh-add ~/.ssh/id_rsa
```

```bash
ssh-add ~/.ssh/id_rsa_work
```

<br>

# Git config

#### Step 1: Create a custom .gitconfig_work file

Create an empty file next to your `.gitconfig` file e.g. `~/.gitconfig_work`

Here you can specify the custom attributes you need.

```
[user]
name = Jonathon Fry
email = j.fry@work.com
```

#### Step 2: Update your .gitconfig file

Next you need to update your `.gitconfig` file to specify the root directory to apply your custom git config to e.g. `~/Documents/work`

```
[includeIf "gitdir:~/Documents/Work/"]
	path = .gitconfig_work
```
This works by allowing you to apply a custom git config file to all subdirectories of the root directory provided. 
You can specify as many `includeIf`'s as required e.g. `/Work/Client1` `/Work/Client2` 

<br>

This technique is very flexible and can be applied as many times as needed allowing you to work on any number of projects whilst maintaining custom SSH/git configurations.
