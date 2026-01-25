---
description: Always verify code works before claiming success
---

# Workflow: Verify Before Claiming Success

## Mandatory Steps Before Responding to User

When implementing any feature or fix, ALWAYS follow these steps before claiming it works:

### 1. Build Verification
```bash
npm run build
```
- Check for TypeScript errors
- Check for compilation errors
- Ensure build completes successfully

### 2. Local Testing
```bash
npm run dev
```
- Start development server
- Navigate to the affected page/component
- Verify the feature works as expected
- Check browser console for errors

### 3. Code Quality Checks
- Run linter if applicable
- Check for TypeScript errors: `npx tsc --noEmit`
- Verify no console errors in browser

### 4. Commit Only After Verification
- Only commit and push after confirming everything works
- Include clear commit message describing what was fixed/added

### 5. Response to User
- Only claim success after completing steps 1-4
- If something doesn't work, fix it first, then verify again
- Be honest about what works and what doesn't

## Key Principles

1. **Never claim something works without testing it**
2. **Always run `npm run build` to catch TypeScript errors**
3. **Test in the browser, not just in code**
4. **If build fails, fix it before pushing**
5. **Don't waste user's credits with untested solutions**

## Example Workflow

```bash
# 1. Make changes to code
# 2. Test build
npm run build

# 3. If build succeeds, test locally
npm run dev

# 4. Open browser and verify feature works
# 5. Check browser console for errors

# 6. Only then commit
git add .
git commit -m "Feature X working and verified"
git push

# 7. Respond to user with confidence
```

## Red Flags to Avoid

❌ Saying "it should work" without testing
❌ Pushing code that doesn't build
❌ Claiming success based on code review alone
❌ Ignoring TypeScript errors
❌ Not checking browser console

## Success Criteria

✅ Build completes without errors
✅ Feature visible and working in browser
✅ No console errors
✅ Code committed and pushed
✅ User can verify immediately
