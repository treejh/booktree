package com.example.booktree.user.service;


import com.example.booktree.category.entity.Category;
import com.example.booktree.category.repository.CategoryRepository;
import com.example.booktree.comment.repository.CommentRepository;
import com.example.booktree.email.entity.EmailMessage;
import com.example.booktree.email.service.EmailService;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.follow.repository.FollowRepository;
import com.example.booktree.image.entity.Image;
import com.example.booktree.image.repository.ImageRepository;
import com.example.booktree.image.service.ImageService;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.likecomment.repository.LikeCommentRepository;
import com.example.booktree.likepost.repository.LikePostRepository;
import com.example.booktree.likereply.repository.LikeReplyRepository;
import com.example.booktree.popularpost.service.PopularPostService;
import com.example.booktree.post.entity.Post;
import com.example.booktree.post.repository.PostRepository;
import com.example.booktree.reply.repository.ReplyRepository;
import com.example.booktree.role.entity.Role;
import com.example.booktree.role.repository.RoleRepository;
import com.example.booktree.user.dto.request.UserPasswordRequestDto;
import com.example.booktree.user.dto.request.UserPatchRequestDto;
import com.example.booktree.user.dto.request.UserPhoneNumberRequestDto;
import com.example.booktree.user.dto.request.UserPostRequestDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import com.example.booktree.utils.CreateRandomNumber;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.example.booktree.utils.ImageUtil.DEFAULT_USER_IMAGE;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final FollowRepository followRepository;
    private final CommentRepository commentRepository;
    private final CategoryRepository categoryRepository;
    private final LikeCommentRepository likeCommentRepository;
    private final LikePostRepository likePostRepository;
    private final LikeReplyRepository likeReplyRepository;
    private final PostRepository postRepository;
    private final ReplyRepository replyRepository;
    private final ImageRepository imageRepository;


    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final ImageService imageService;
    private static final String USER_IMAGE= DEFAULT_USER_IMAGE;
    private final PopularPostService popularPostService;


    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }

    public User findByToken() {
        Long userId= tokenService.getIdFromToken();
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }

    public void saveUser(User user){
        userRepository.save(user);
    }


    public User createUser(UserPostRequestDto userPostRequestDto){
        //이메일, 전화번호, 역할 검증
        UserValidation(userPostRequestDto);

        // username 비어있으면 랜덤 UUID 일부로 생성
        String username = userPostRequestDto.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = "bookTree_" + CreateRandomNumber.randomNumber();
        }
        Role role = roleRepository.findById(userPostRequestDto.getRoleId())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.ROLE_NOT_FOUND)); // 직접 예외 처리

        User user = User.builder()
                .email(userPostRequestDto.getEmail())
                .password(passwordEncoder.encode(userPostRequestDto.getPassword()))
                .phoneNumber(userPostRequestDto.getPhoneNumber())
                //이미 UserValidation에서 검증을 했기 때문에 get() 사용
                .image(USER_IMAGE)
                .role(role)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .username(username).build();

        return userRepository.save(user);
    }

    public User createAdmin(UserPostRequestDto userPostRequestDto){
        //이메일, 전화번호, 역할 검증
        UserValidation(userPostRequestDto);

        // username 비어있으면 랜덤 UUID 일부로 생성
        String username = userPostRequestDto.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = "Admin_" + CreateRandomNumber.randomNumber();
        }

        User user = User.builder()
                .email(userPostRequestDto.getEmail())
                .password(passwordEncoder.encode(userPostRequestDto.getPassword()))
                .phoneNumber(userPostRequestDto.getPhoneNumber())
                //이미 UserValidation에서 검증을 했기 때문에 get() 사용
                .role(roleRepository.findById(userPostRequestDto.getRoleId()).get())
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .username(username).build();

        return userRepository.save(user);
    }



    public User findUserByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

    }

    public void findPasswordByEmail(String email){
        EmailMessage emailMessage = EmailMessage.builder()
                .to(email)
                .subject("[BookTree] 임시 비밀번호 발급")
                .build();
        User user = findUserByEmail(email);
        String randomPassword = CreateRandomNumber.randomNumber();
        user.setPassword(passwordEncoder.encode(randomPassword));
        userRepository.save(user);

        emailService.sendMail(emailMessage, "password",randomPassword);

    }
    //임시 비밀번호 발급 - 이메일, 핸드폰으로 비밀번호
    public String findPasswordByEmailAndPhone(UserPasswordRequestDto.FindPwByEmailAndPhone findPwByEmailAndPhone){

        User user = userRepository.findByEmailAndPhoneNumber(findPwByEmailAndPhone.getEmail(), findPwByEmailAndPhone.getPhoneNumber())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        String randomPassword = CreateRandomNumber.randomNumber();
        user.setPassword(passwordEncoder.encode(randomPassword));
        userRepository.save(user);

        return randomPassword;
    }



    //임시 비밀번호 발급 - 핸드폰 번호로 비밀번호
    public String findPasswordByPhoneNumber(String phoneNumber){

        User user = findUserByPhoneNumber(phoneNumber);
        String randomPassword = CreateRandomNumber.randomNumber();
        user.setPassword(passwordEncoder.encode(randomPassword));

        userRepository.save(user);
        return randomPassword;
    }




    //아이디 찾기 - 핸드폰 번호로
    public String findEmailByPhoneNumber(UserPhoneNumberRequestDto userPhoneNumberRequestDto){
        User user = findUserByPhoneNumber(userPhoneNumberRequestDto.getPhoneNumber());
        return user.getEmail();
    }




    public User findUserByPhoneNumber(String phoneNumber){
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

    }

    public User findUserByPassword(String passWord){
        return userRepository.findByPassword(passWord)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

    }



    public void validPasswordCorrect(UserPasswordRequestDto.PasswordDto passwordDto){
        Long userId = tokenService.getIdFromToken();
        User user = findById(userId);
        if(!passwordEncoder.matches(passwordDto.getPassword(),user.getPassword())){
            throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
        };
    }



    public boolean validPassword(String dtoPassword, String userPassword){
        return passwordEncoder.matches(dtoPassword,userPassword);
    }




    public void UserValidation(UserPostRequestDto userPostRequestDto){
        validationEmail(userPostRequestDto.getEmail());
        validationPhoneNumber(userPostRequestDto.getPhoneNumber());
        roleValidation(userPostRequestDto.getRoleId());

    }

    //토큰으로 유저 조회
    @Transactional
    public User findUsersByToken(){
        return userRepository.findById(tokenService.getIdFromToken())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }


    //유저 수정
    //UserPatchRequestDto
    public User updateUser(UserPatchRequestDto userPatchRequestDto){
        //이게 필요한가 ..? ㄷ
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        Optional.ofNullable(userPatchRequestDto.getUsername()).ifPresent(user::setUsername);
        Optional.ofNullable(userPatchRequestDto.getEmail()).ifPresent(user::setEmail);
        Optional.ofNullable(userPatchRequestDto.getPassword())
                .ifPresent(password -> user.setPassword(passwordEncoder.encode(password)));
        Optional.ofNullable(userPatchRequestDto.getPhoneNumber()).ifPresent(user::setPhoneNumber);

        user.setModifiedAt(LocalDateTime.now());

        userRepository.save(user);
        return user;

    }

    @Transactional
    public void deleteUser() {
        Long userId = tokenService.getIdFromToken();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        // 1. 팔로우
        followRepository.deleteByFollower(user);
        followRepository.deleteByFollowed(user);

        // 2. 답글 좋아요 → 답글
        likeReplyRepository.deleteByReplyCommentPostUser(user);
        likeReplyRepository.deleteByReplyUser(user);
        likeReplyRepository.deleteByUser(user);
        replyRepository.deleteByCommentPostUser(user);
        replyRepository.deleteByCommentUser(user);
        replyRepository.deleteByUser(user);

        // 3. 댓글 좋아요 → 댓글
        likeCommentRepository.deleteByCommentPostUser(user);
        likeCommentRepository.deleteByCommentUser(user);
        likeCommentRepository.deleteByUser(user);
        commentRepository.deleteByPostUser(user);
        commentRepository.deleteByUser(user);

        // 4. 게시글 좋아요 → 게시글
        likePostRepository.deleteByPostUser(user);
        likePostRepository.deleteByUser(user);
        List<Post> userPosts = postRepository.findByUser(user);


        for (Post post : userPosts) {
            // 해당 게시글에 연결된 이미지들 목록을 가져옴
            List<Image> imageList = post.getImageList();
            Long categoryId = post.getMainCategory().getId(); // 게시글의 메인 카테고리
            popularPostService.removePostFromPopularity(post.getId(), categoryId); // Redis 정

            for (Image image : imageList) {
                imageService.deleteFile(image.getImageUrl());
                imageRepository.delete(image);
            }
        }
        imageRepository.flush();

        postRepository.deleteByUser(user);

        // 5. 카테고리 → 유저 삭제
        List<Category> categories = categoryRepository.findByUser(user);
        if (!categories.isEmpty()) {
            categoryRepository.deleteByUser(user);
        }

        // 6. 유저 삭제
        userRepository.delete(user);
    }







    public void deleteUserById(Long userId){
        User user = ownerValidation(userId);
        userRepository.delete(user);
    }





    public User updatePw(UserPasswordRequestDto userPasswordRequestDto){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        //비밀번호 다르면 변경 불가
        pwValidation(userPasswordRequestDto.getBeforePassword(),user.getPassword());

        user.setPassword(passwordEncoder.encode(userPasswordRequestDto.getChangePassword()));
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updateEmail(String email){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        user.setEmail(email);
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);

    }

    public User updateUserName(String name){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        user.setUsername(name);
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updatePhoneNumber(UserPhoneNumberRequestDto userPhoneNumberRequestDto){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        user.setPhoneNumber(userPhoneNumberRequestDto.getPhoneNumber());
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updateExtraInfo(Long userId, UserPhoneNumberRequestDto userPhoneNumberRequestDto){
        User user = ownerValidation(userId);  // userId를 직접 사용하는 방식
        user.setPhoneNumber(userPhoneNumberRequestDto.getPhoneNumber());
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);
    }




    public User ownerValidation(Long userId){
        User user = findById(userId);


        if (!userId.equals(user.getId())) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_OWNER);
        }

        return user;
    }




    public void pwValidation(String beforePassword, String currentPassword){
        if (!passwordEncoder.matches(beforePassword, currentPassword)) {
            throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
        }
    }

    public void roleValidation(Long roleId){
        roleRepository.findById(roleId)
                .orElseThrow(()-> new BusinessLogicException(ExceptionCode.ROLE_NOT_FOUND));

    }


    public void validationEmail(String email){
        userRepository.findByEmail(email)
                .ifPresent(user -> {
                    throw new BusinessLogicException(ExceptionCode.ALREADY_HAS_EMAIL);
                });
    }

    public void validationPhoneNumber(String phoneNumber){
        userRepository.findByPhoneNumber(phoneNumber)
                .ifPresent(user -> {
                    throw new BusinessLogicException(ExceptionCode.ALREADY_HAS_PHONENUMBER);
                });

    }

    public void modify(User user, @NotBlank String username){
        user.setUsername(username);
    }

    public User modifyOrJoins(String email, String username,String provider, String socialId){
        Optional<User> opUser = userRepository.findByEmail(email);

        if(opUser.isPresent()){
            User user = opUser.get();
            modify(user,username);
            return user;
        }

        return createSocialUser(email, "",username,provider,socialId);
    }


    public User createSocialUser(String email, String password, String username,String provider,String socialId){


        Role role = roleRepository.findById(1L)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.ROLE_NOT_FOUND)); // 직접 예외 처리


        User user = User.builder()
                .email(email)
                .password(password)
                .username(username)
                .phoneNumber(" ")
                .image(USER_IMAGE)
                .ssoProvider(provider)
                .role(role)
                .socialId(socialId)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }


    @Transactional
    public Optional<User> findBySocialIdAndSsoProvider(String socialId, String ssoProvider){
        return userRepository.findBySocialIdAndSsoProvider(socialId, ssoProvider);
    }


    //사용자 이미지 저장
    public String saveImageToUser(MultipartFile image){
        Long userId = tokenService.getIdFromToken();
        User user = findById(userId);
        String imageUrl = imageService.saveUserImage(image);
        user.setImage(imageUrl);
        userRepository.save(user);

        return imageUrl;

    }

    //사용자 이미지 수정
    public String updateImageToUser(MultipartFile image) {
        User user = findById(tokenService.getIdFromToken());
        String imageUrl = imageService.saveUserImage(image);

        if (user.getImage() == null || user.getImage().isEmpty()) {
            // 이미지가 없거나 비어있는 경우 새 이미지 URL을 저장
            user.setImage(imageUrl);
            userRepository.save(user);
        } else {
            // 기존 이미지가 있으면 삭제 후 새 이미지 저장
            imageService.deleteFile(user.getImage());
            user.setImage(imageUrl);
            userRepository.save(user);
        }

        return imageUrl;
    }


    //사용자 이미지 삭제
    public void deleteImageToUser(){
        Long userId = tokenService.getIdFromToken();
        User user = findById(userId);

        //이미지 삭제
        imageService.deleteFile(user.getImage());

        user.setImage(null);
        userRepository.save(user);
    }


    //사용자 이미지 조회
    public String getImageToUser(){
        Long userId = tokenService.getIdFromToken();
        User user = findById(userId);

       return user.getImage();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }

}
