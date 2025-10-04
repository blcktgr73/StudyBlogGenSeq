-- Fix trigger WHEN conditions
-- DELETE triggers cannot reference NEW values

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_update_post_like_count ON likes;
DROP TRIGGER IF EXISTS trigger_update_comment_like_count ON likes;

-- Recreate with fixed WHEN conditions
CREATE TRIGGER trigger_update_post_like_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION update_post_like_count();

CREATE TRIGGER trigger_update_comment_like_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION update_comment_like_count();
