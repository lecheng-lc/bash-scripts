#!/bin/bash

# 变量定义
tagName=$(date +"v%Y.%m.%d.%H%M")

# 函数定义
function prompt_error () {
    echo -e "\033[4;31m${1}\033[0m"
    exit 2
}
function prompt_success () {
    echo -e "\033[4;33m${1}\033[0m"
}

# 切换到master分支
git checkout master
if [ $? -eq 0 ];then
    prompt_success "Git checkout branch master succeeded."
else
    prompt_error "Git checkout branch master failed."
fi

# 拉取合并代码
git pull
if [ $? -eq 0 ];then
    prompt_success "Git pull succeeded."
else
    prompt_error "Git pull failed."
fi

# 创建tag
if [ $# -gt 0 ];then
    git tag -a ${tagName} -m "$*"
    if [ $? -eq 0 ];then
        prompt_success "Git create tag ${tagName}[$*] succeeded."
    else
        prompt_error "Git create tag ${tagName}[$*] failed."
    fi
else
    git tag ${tagName}
    if [ $? -eq 0 ];then
        prompt_success "Git create tag ${tagName} succeeded."
    else
        prompt_error "Git create tag ${tagName} failed."
    fi
fi

# 推送tag
git push origin ${tagName}
if [ $? -eq 0 ];then
    prompt_success "Git push tag ${tagName} to origin succeeded."
else
    prompt_error "Git push tag ${tagName} to origin failed."
fi