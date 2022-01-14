#!/bin/bash

help="release.sh \
-p <platform>"

while getopts ":p:h:" opt
do
    case $opt in
        p)
        platform=$OPTARG
        ;;
        h)
        echo "$help"
        exit 1;;
        ?)
        echo "$help"
        exit 1;;
    esac
done

if [ -z "$platform" ]; then
  echo "$help"
  exit 1
fi

if [ ! -d "outputs" ]; then
  mkdir outputs
else
  rm -rf outputs
  mkdir outputs
fi

current=$(date "+%Y-%m-%d_%H:%M:%S")

watchman watch-del-all
rm -rf node_modules
yarn install
rm -rf /tmp/metro-*

cd example || exit 1

watchman watch-del-all
rm -rf node_modules
yarn install
rm -rf /tmp/metro-*

if [ "$platform" == "android" ]; then
    cd android || exit 1
    chmod +x ./gradlew
    ./gradlew clean
    ./gradlew assembleRelease
    mv ./app/build/outputs/apk/release/app-release.apk ../../outputs/"rn-im-example-$current".apk || exit 1
elif [ "$platform" == "ios" ]; then
    cd ios || exit 1
    pod update
    pod install

    xcodebuild clean \
               -workspace "./ReactNativeImlibExample.xcworkspace" \
               -scheme "ReactNativeImlibExample" \
               -configuration "Release" \
               -quiet

    xcodebuild archive \
               -workspace "./ReactNativeImlibExample.xcworkspace" \
               -scheme "ReactNativeImlibExample" \
               -archivePath "./build/ReactNativeImlibExample.xcarchive" \
               -configuration "Release" \
               -sdk iphoneos \
               APP_PROFILE="" \
               SHARE_PROFILE="" \
               -allowProvisioningUpdates
             
    xcodebuild -exportArchive \
               -archivePath "./build/ReactNativeImlibExample.xcarchive" \
               -exportOptionsPlist "archive.plist" \
               -exportPath "./build" \
               -allowProvisioningUpdates
    
    mv ./build/ReactNativeImlibExample.ipa ../../outputs/"rn-im-example-$current".ipa || exit 1
fi
